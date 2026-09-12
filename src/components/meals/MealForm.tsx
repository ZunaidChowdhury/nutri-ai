'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Button,
  Chip,
  FieldError,
  Input,
  Label,
  ListBox,
  Modal,
  Select,
  TextArea,
  TextField,
  useOverlayState,
} from '@heroui/react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { UploadButton } from '@uploadthing/react';
import { z } from 'zod';
import { createMeal, updateMeal } from '@/lib/actions/meal';
import { getAuthToken } from '@/lib/core/server';
import { classifyMeal, type ClassificationResult } from '@/lib/api/classification';
import { createCuisine } from '@/lib/api/cuisine';
import { useCuisines, formatCuisineName } from '@/lib/hooks/useCuisines';
import { useSession } from '@/lib/auth/client';
import { AgentLoadingState } from '@/components/ai/AgentLoadingState';
import type { OurFileRouter } from '@/app/api/uploadthing/core';
import type { Meal } from '@/lib/types/meal';

const mealSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  fullDescription: z.string().min(1, 'Full description is required'),
  calories: z.coerce.number().min(0, 'Calories must be 0 or greater'),
  protein: z.coerce.number().min(0, 'Protein must be 0 or greater'),
  carbs: z.coerce.number().min(0, 'Carbs must be 0 or greater'),
  fat: z.coerce.number().min(0, 'Fat must be 0 or greater'),
  cuisineTag: z.string().min(1, 'Cuisine tag is required'),
  visibility: z.enum(['public', 'private']).default('public'),
});

interface FormState {
  title: string;
  shortDescription: string;
  fullDescription: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  cuisineTag: string;
  visibility: 'public' | 'private';
}

interface FieldErrors {
  [key: string]: string;
}

interface MealFormProps {
  mode: 'create' | 'edit';
  meal?: Meal;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function buildInitialForm(meal?: Meal): FormState {
  if (meal) {
    return {
      title: meal.title,
      shortDescription: meal.shortDescription,
      fullDescription: meal.fullDescription,
      calories: String(meal.calories),
      protein: String(meal.macros.protein),
      carbs: String(meal.macros.carbs),
      fat: String(meal.macros.fat),
      cuisineTag: meal.cuisineTag,
      visibility: meal.visibility,
    };
  }
  return {
    title: '',
    shortDescription: '',
    fullDescription: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    cuisineTag: '',
    visibility: 'public',
  };
}

export function MealForm({ mode, meal }: MealFormProps) {
  const isEdit = mode === 'edit';
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const user = session?.user as { role?: 'user' | 'admin' } | undefined;
  const isAdmin = user?.role === 'admin';
  const { cuisineNames } = useCuisines();

  const [imageUrl, setImageUrl] = useState(meal?.imageUrl ?? '');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState('');
  const [form, setForm] = useState<FormState>(() => buildInitialForm(meal));

  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [userOverrodeCuisine, setUserOverrodeCuisine] = useState(false);
  const tokenRef = useRef<string | null>(null);

  // Admin Add Cuisine state
  const [isAddCuisineOpen, setIsAddCuisineOpen] = useState(false);
  const [newCuisineName, setNewCuisineName] = useState('');
  const [addCuisineError, setAddCuisineError] = useState('');

  const addCuisineModal = useOverlayState({
    isOpen: isAddCuisineOpen,
    onOpenChange: (open) => {
      setIsAddCuisineOpen(open);
      if (!open) {
        setNewCuisineName('');
        setAddCuisineError('');
      }
    },
  });

  const addCuisineMutation = useMutation({
    mutationFn: async (name: string) => {
      const token = await getAuthToken();
      if (!token) throw new Error('You must be logged in to add a cuisine');
      return createCuisine(name, token);
    },
    onSuccess: (newCuisine) => {
      queryClient.invalidateQueries({ queryKey: ['cuisines'] });
      const formatted = formatCuisineName(newCuisine.name);
      updateField('cuisineTag', formatted);
      setUserOverrodeCuisine(true);
      setNewCuisineName('');
      setAddCuisineError('');
      setIsAddCuisineOpen(false);
    },
    onError: (err: unknown) => {
      const error = err as { message?: string };
      setAddCuisineError(error?.message || 'Failed to add cuisine');
    },
  });

  useEffect(() => {
    getAuthToken().then((t) => { tokenRef.current = t; });
  }, []);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const debouncedTitle = useDebounce(form.title, 800);
  const debouncedDescription = useDebounce(form.shortDescription, 800);

  useEffect(() => {
    if (isEdit) return;
    if (!debouncedTitle || !debouncedDescription || !tokenRef.current) return;
    let cancelled = false;
    setIsClassifying(true);
    classifyMeal(debouncedTitle, debouncedDescription, tokenRef.current).then((result) => {
      if (cancelled) return;
      setClassification(result);
      setIsClassifying(false);
      if (result && !userOverrodeCuisine && !form.cuisineTag) {
        updateField('cuisineTag', result.cuisineTag);
      }
    });
    return () => { cancelled = true; };
  }, [debouncedTitle, debouncedDescription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    const payload = {
      ...form,
      calories: form.calories || '0',
      protein: form.protein || '0',
      carbs: form.carbs || '0',
      fat: form.fat || '0',
    };

    const result = mealSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        if (issue.path.length > 0) {
          fieldErrors[String(issue.path[0])] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await getAuthToken();
      if (!token) {
        router.push('/login');
        return;
      }

      const data = {
        title: form.title,
        shortDescription: form.shortDescription,
        fullDescription: form.fullDescription,
        imageUrl: imageUrl || undefined,
        calories: result.data.calories,
        macros: {
          protein: result.data.protein,
          carbs: result.data.carbs,
          fat: result.data.fat,
        },
        cuisineTag: form.cuisineTag,
        visibility: form.visibility,
      };

      if (isEdit && meal) {
        await updateMeal(meal._id, data, token);
      } else {
        await createMeal(data, token);
      }

      router.push('/items/manage');
    } catch (err: unknown) {
      const error = err as { code?: string; status?: number; message?: string };
      if (error?.status === 401) {
        setServerError('Your session has expired. Please sign in again.');
      } else if (error?.status === 403) {
        setServerError(error?.message || "You don't have permission to modify this meal.");
      } else {
        setServerError(error?.message || `Failed to ${isEdit ? 'update' : 'create'} meal. Please try again.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 px-4 md:px-8 py-6 md:py-10 max-w-[1280px] mx-auto w-full">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {/* Back Link */}
        <Link
          href="/items/manage"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#55706B] dark:text-[#A1B8B3] hover:text-[#007F78] dark:hover:text-[#2DD4BF] transition-colors !no-underline w-fit"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Manage Meals
        </Link>

        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold text-[#163330] dark:text-[#E8F2EF]">
            {isEdit ? 'Edit Meal' : 'Add Meal'}
          </h1>
          <p className="text-[#55706B] dark:text-[#A1B8B3]">
            {isEdit
              ? 'Update the details and nutrition profile of your meal.'
              : 'Share your nutritious creation with the community.'}
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] overflow-hidden shadow-sm">
          {/* Accent bar */}
          <div className="h-1 bg-gradient-to-r from-[#007F78] to-[#65B82E]" />

          <div className="p-6">
            <h2 className="text-lg font-semibold text-[#163330] dark:text-[#E8F2EF] mb-5">Meal Details</h2>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              {/* Title */}
              <TextField
                isInvalid={!!errors.title}
                isRequired
                className="w-full"
              >
                <Label>Title</Label>
                <Input
                  placeholder="e.g., Grilled Chicken Salad"
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  fullWidth
                />
                {errors.title && <FieldError>{errors.title}</FieldError>}
              </TextField>

              {/* Short Description */}
              <TextField
                isInvalid={!!errors.shortDescription}
                isRequired
                className="w-full"
              >
                <Label>Short Description</Label>
                <Input
                  placeholder="A brief summary of the meal"
                  value={form.shortDescription}
                  onChange={(e) => updateField('shortDescription', e.target.value)}
                  fullWidth
                />
                {errors.shortDescription && (
                  <FieldError>{errors.shortDescription}</FieldError>
                )}
              </TextField>

              {/* Full Description */}
              <TextField
                isInvalid={!!errors.fullDescription}
                isRequired
                className="w-full"
              >
                <Label>Full Description</Label>
                <TextArea
                  placeholder="Describe the meal in detail, including ingredients and preparation..."
                  value={form.fullDescription}
                  onChange={(e) => updateField('fullDescription', e.target.value)}
                  fullWidth
                />
                {errors.fullDescription && (
                  <FieldError>{errors.fullDescription}</FieldError>
                )}
              </TextField>

              {/* Cuisine Select + AI Classification */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#163330] dark:text-[#E8F2EF]">
                    Cuisine <span className="text-red-500">*</span>
                  </span>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddCuisineOpen(true);
                        setAddCuisineError('');
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#007F78] dark:text-[#2DD4BF] hover:text-[#005F5A] dark:hover:text-[#5EEAD4] cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Add Cuisine</span>
                    </button>
                  )}
                </div>

                <Select
                  aria-label="Cuisine"
                  placeholder="Select a cuisine type"
                  value={form.cuisineTag || null}
                  onChange={(key) => {
                    const val = (key as string) || '';
                    setUserOverrodeCuisine(true);
                    updateField('cuisineTag', val);
                  }}
                  isInvalid={!!errors.cuisineTag}
                  isRequired
                  fullWidth
                >
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {cuisineNames.map((tag) => (
                        <ListBox.Item key={tag} id={tag} textValue={tag}>
                          {tag}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>

                {errors.cuisineTag && (
                  <p className="text-sm text-red-500">{errors.cuisineTag}</p>
                )}

                {!isEdit && isClassifying && (
                  <AgentLoadingState agentName="Food Classification" />
                )}

                {!isEdit &&
                  !isClassifying &&
                  classification &&
                  !userOverrodeCuisine &&
                  form.cuisineTag === classification.cuisineTag && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#DDF5F0] dark:bg-[#007F78]/25 border border-[#007F78]/20 dark:border-[#007F78]/40">
                      <svg className="w-4 h-4 text-[#007F78] dark:text-[#2DD4BF] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="text-xs text-[#007F78] dark:text-[#2DD4BF]">AI suggested</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-[#007F78] text-white">
                        {Math.round(classification.confidence * 100)}% confidence
                      </span>
                    </div>
                  )}
              </div>

              {/* Visibility Select */}
              <div className="flex flex-col gap-2">
                <Select
                  placeholder="Select visibility"
                  value={form.visibility}
                  onChange={(key) => {
                    updateField('visibility', (key as 'public' | 'private') || 'public');
                  }}
                  isDisabled={isEdit && !!meal?.lockedVisibility}
                  isRequired
                  fullWidth
                >
                  <Label>Visibility</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      <ListBox.Item id="public" textValue="Public">
                        <div className="flex flex-col">
                          <span>Public</span>
                          <span className="text-xs text-[#849A95] dark:text-[#6E8883]">
                            Visible to everyone on the Explore page
                          </span>
                        </div>
                      </ListBox.Item>
                      <ListBox.Item id="private" textValue="Private">
                        <div className="flex flex-col">
                          <span>Private</span>
                          <span className="text-xs text-[#849A95] dark:text-[#6E8883]">
                            Only visible to you
                          </span>
                        </div>
                      </ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                </Select>
                {isEdit && meal?.lockedVisibility && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FEF3C7] dark:bg-[#F59E0B]/20 border border-[#FDE68A] dark:border-[#F59E0B]/30">
                    <svg className="w-4 h-4 text-[#92400E] dark:text-[#FCD34D] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p className="text-sm text-[#92400E] dark:text-[#FCD34D]">
                      Visibility is locked by an admin and cannot be changed here.
                    </p>
                  </div>
                )}
              </div>

              {/* Nutrition — Macros */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-[#163330] dark:text-[#E8F2EF] flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                  Nutrition Information
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <TextField
                    isInvalid={!!errors.calories}
                    className="w-full"
                  >
                    <Label>Calories</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={form.calories}
                      onChange={(e) => updateField('calories', e.target.value)}
                      fullWidth
                    />
                    {errors.calories && <FieldError>{errors.calories}</FieldError>}
                  </TextField>
                  <TextField
                    isInvalid={!!errors.protein}
                    className="w-full"
                  >
                    <Label>Protein (g)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={form.protein}
                      onChange={(e) => updateField('protein', e.target.value)}
                      fullWidth
                    />
                    {errors.protein && <FieldError>{errors.protein}</FieldError>}
                  </TextField>
                  <TextField
                    isInvalid={!!errors.carbs}
                    className="w-full"
                  >
                    <Label>Carbs (g)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={form.carbs}
                      onChange={(e) => updateField('carbs', e.target.value)}
                      fullWidth
                    />
                    {errors.carbs && <FieldError>{errors.carbs}</FieldError>}
                  </TextField>
                  <TextField
                    isInvalid={!!errors.fat}
                    className="w-full"
                  >
                    <Label>Fat (g)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={form.fat}
                      onChange={(e) => updateField('fat', e.target.value)}
                      fullWidth
                    />
                    {errors.fat && <FieldError>{errors.fat}</FieldError>}
                  </TextField>
                </div>
              </div>

              {/* Image Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#163330] dark:text-[#E8F2EF]">
                  Meal Image <span className="text-[#849A95] dark:text-[#6E8883] text-sm">(optional)</span>
                </label>
                {imageUrl ? (
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-[#DCE9E4] dark:border-[#263835] bg-[#EEF7F3] dark:bg-[#1b2b28]">
                    <img
                      src={imageUrl}
                      alt="Uploaded meal"
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#163330] dark:text-[#E8F2EF]">Image uploaded</p>
                      <p className="text-xs text-[#849A95] dark:text-[#6E8883] truncate">{imageUrl.split('/').pop()}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium text-red-500 border border-red-200 dark:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="p-6 rounded-xl border-2 border-dashed border-[#DCE9E4] dark:border-[#263835] bg-[#F7FAF8] dark:bg-[#1b2b28] hover:bg-[#EEF7F3] dark:hover:bg-[#203330] transition-colors">
                    <UploadButton<OurFileRouter, 'mealImage'>
                      endpoint="mealImage"
                      onClientUploadComplete={(res) => {
                        if (res?.[0]) {
                          setImageUrl(res[0].url);
                        }
                        setIsUploading(false);
                      }}
                      onUploadError={(error: Error) => {
                        setServerError(error.message);
                        setIsUploading(false);
                      }}
                      onUploadBegin={() => setIsUploading(true)}
                    />
                  </div>
                )}
              </div>

              {/* Server Error */}
              {serverError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                  <svg className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-600 dark:text-red-400">{serverError}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="w-full py-3 rounded-xl bg-[#007F78] hover:bg-[#005F5A] disabled:opacity-50 text-white font-medium text-base transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {isEdit ? 'Saving...' : 'Creating...'}
                  </>
                ) : (
                  isEdit ? 'Save Changes' : 'Create Meal'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Admin Add Cuisine Modal */}
      {isAdmin && (
        <Modal state={addCuisineModal}>
          <Modal.Backdrop>
            <Modal.Container placement="center" size="sm">
              <Modal.Dialog>
                <Modal.Header>
                  <Modal.Heading className="text-lg font-bold text-[#163330] dark:text-[#E8F2EF]">
                    Add New Cuisine Type
                  </Modal.Heading>
                </Modal.Header>
                <Modal.Body className="flex flex-col gap-3">
                  <p className="text-xs text-[#55706B] dark:text-[#A1B8B3]">
                    As an admin, you can introduce a new cuisine category. It will be available for all meals platform-wide.
                  </p>
                  <TextField isRequired fullWidth>
                    <Label>Cuisine Name</Label>
                    <Input
                      placeholder="e.g., Ethiopian, Peruvian, Turkish"
                      value={newCuisineName}
                      onChange={(e) => {
                        setNewCuisineName(e.target.value);
                        setAddCuisineError('');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newCuisineName.trim()) {
                            addCuisineMutation.mutate(newCuisineName.trim());
                          }
                        }
                      }}
                      autoFocus
                    />
                  </TextField>
                  {addCuisineError && (
                    <p className="text-xs text-red-500">{addCuisineError}</p>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onPress={() => setIsAddCuisineOpen(false)}
                    isDisabled={addCuisineMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-[#007F78] hover:bg-[#005F5A] text-white"
                    isPending={addCuisineMutation.isPending}
                    onPress={() => {
                      if (!newCuisineName.trim()) {
                        setAddCuisineError('Please enter a cuisine name');
                        return;
                      }
                      addCuisineMutation.mutate(newCuisineName.trim());
                    }}
                  >
                    Create Cuisine
                  </Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      )}
    </div>
  );
}