'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  Chip,
  FieldError,
  Input,
  Label,
  ListBox,
  Select,
  TextArea,
  TextField,
} from '@heroui/react';
import { UploadButton } from '@uploadthing/react';
import { z } from 'zod';
import { createMeal, updateMeal } from '@/lib/actions/meal';
import { getAuthToken } from '@/lib/core/server';
import { classifyMeal, type ClassificationResult } from '@/lib/api/classification';
import { AgentLoadingState } from '@/components/ai/AgentLoadingState';
import type { OurFileRouter } from '@/app/api/uploadthing/core';
import type { Meal } from '@/lib/types/meal';

const CUISINE_TAGS = [
  'Italian', 'Mexican', 'Japanese', 'Indian', 'American',
  'Mediterranean', 'Chinese', 'Thai', 'French', 'Korean',
  'Middle Eastern', 'Vietnamese',
];

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
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-2xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold">
          {isEdit ? 'Edit Meal' : 'Add Meal'}
        </h1>
        <p className="text-muted">
          {isEdit
            ? 'Update the details of your meal'
            : 'Share your nutritious creation with the community'}
        </p>
      </div>

      <Card className="border border-border dark:border-border">
        <Card.Header className="pb-0 px-6 pt-6">
          <h2 className="text-lg font-semibold">Meal Details</h2>
        </Card.Header>
        <Card.Content className="gap-5 p-6">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
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

            <div className="flex flex-col gap-2">
              <Select
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
                <Label>Cuisine</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {CUISINE_TAGS.map((tag) => (
                      <ListBox.Item key={tag} id={tag} textValue={tag}>
                        {tag}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>

              {errors.cuisineTag && (
                <p className="text-sm text-danger">{errors.cuisineTag}</p>
              )}

              {!isEdit && isClassifying && (
                <AgentLoadingState agentName="Food Classification" />
              )}

              {!isEdit &&
                !isClassifying &&
                classification &&
                !userOverrodeCuisine &&
                form.cuisineTag === classification.cuisineTag && (
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span>AI suggested</span>
                    <Chip size="sm" variant="soft" color="accent">
                      {Math.round(classification.confidence * 100)}% confidence
                    </Chip>
                  </div>
                )}
            </div>

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
                        <span className="text-xs text-muted">
                          Visible to everyone on the Explore page
                        </span>
                      </div>
                    </ListBox.Item>
                    <ListBox.Item id="private" textValue="Private">
                      <div className="flex flex-col">
                        <span>Private</span>
                        <span className="text-xs text-muted">
                          Only visible to you
                        </span>
                      </div>
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
              {isEdit && meal?.lockedVisibility && (
                <p className="text-sm text-warning">
                  Visibility is locked by an admin and cannot be changed here.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            </div>

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

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                Meal Image <span className="text-muted text-sm">(optional)</span>
              </label>
              {imageUrl ? (
                <div className="flex items-center gap-3 p-3 rounded-xl border border-border dark:border-border bg-surface-secondary">
                  <img
                    src={imageUrl}
                    alt="Uploaded meal"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex flex-col gap-1 flex-1">
                    <p className="text-sm text-foreground">Image uploaded</p>
                    <p className="text-xs text-muted truncate">{imageUrl.split('/').pop()}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="danger-soft"
                    onPress={() => setImageUrl('')}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="p-4 rounded-xl border-2 border-dashed border-border dark:border-border bg-surface-secondary/50 hover:bg-surface-secondary/50 transition-colors">
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

            {serverError && (
              <div className="p-3 rounded-lg bg-danger-soft dark:bg-danger-soft text-danger text-sm">
                {serverError}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isPending={isSubmitting}
              isDisabled={isUploading}
              className="w-full"
            >
              {isEdit ? 'Save Changes' : 'Create Meal'}
            </Button>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
}