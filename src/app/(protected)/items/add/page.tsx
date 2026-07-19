'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Textarea } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { Button } from '@heroui/button';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { UploadButton } from '@uploadthing/react';
import { z } from 'zod';
import { createMeal } from '@/lib/actions/meal';
import { getAuthToken } from '@/lib/core/server';
import { classifyMeal, type ClassificationResult } from '@/lib/api/classification';
import { AgentLoadingState } from '@/components/ai/AgentLoadingState';
import type { OurFileRouter } from '@/app/api/uploadthing/core';

const CUISINE_TAGS = [
  'Italian', 'Mexican', 'Japanese', 'Indian', 'American',
  'Mediterranean', 'Chinese', 'Thai', 'French', 'Korean',
  'Middle Eastern', 'Vietnamese',
];

const mealSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  fullDescription: z.string().min(1, 'Full description is required'),
  calories: z.number().min(0, 'Calories must be 0 or greater'),
  protein: z.number().min(0, 'Protein must be 0 or greater'),
  carbs: z.number().min(0, 'Carbs must be 0 or greater'),
  fat: z.number().min(0, 'Fat must be 0 or greater'),
  cuisineTag: z.string().min(1, 'Cuisine tag is required'),
});

type MealFormData = z.infer<typeof mealSchema>;

interface FieldErrors {
  [key: string]: string;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function AddMealPage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState('');
  const [form, setForm] = useState<MealFormData>({
    title: '',
    shortDescription: '',
    fullDescription: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    cuisineTag: '',
  });

  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [userOverrodeCuisine, setUserOverrodeCuisine] = useState(false);
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    getAuthToken().then((t) => { tokenRef.current = t; });
  }, []);

  const updateField = <K extends keyof MealFormData>(key: K, value: MealFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const debouncedTitle = useDebounce(form.title, 800);
  const debouncedDescription = useDebounce(form.shortDescription, 800);

  useEffect(() => {
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

    const result = mealSchema.safeParse(form);
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

      await createMeal(
        {
          title: form.title,
          shortDescription: form.shortDescription,
          fullDescription: form.fullDescription,
          imageUrl: imageUrl || undefined,
          calories: form.calories,
          macros: {
            protein: form.protein,
            carbs: form.carbs,
            fat: form.fat,
          },
          cuisineTag: form.cuisineTag,
        },
        token
      );

      router.push('/items/manage');
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      setServerError(error?.message || 'Failed to create meal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-2xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold">Add Meal</h1>
        <p className="text-default-500">Share your nutritious creation with the community</p>
      </div>

      <Card className="border border-default-200 dark:border-default-100">
        <CardHeader className="pb-0 px-6 pt-6">
          <h2 className="text-lg font-semibold">Meal Details</h2>
        </CardHeader>
        <CardBody className="gap-5 p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Title"
              placeholder="e.g., Grilled Chicken Salad"
              value={form.title}
              onValueChange={(v) => updateField('title', v)}
              isInvalid={!!errors.title}
              errorMessage={errors.title}
              isRequired
            />

            <Input
              label="Short Description"
              placeholder="A brief summary of the meal"
              value={form.shortDescription}
              onValueChange={(v) => updateField('shortDescription', v)}
              isInvalid={!!errors.shortDescription}
              errorMessage={errors.shortDescription}
              isRequired
            />

            <Textarea
              label="Full Description"
              placeholder="Describe the meal in detail, including ingredients and preparation..."
              value={form.fullDescription}
              onValueChange={(v) => updateField('fullDescription', v)}
              isInvalid={!!errors.fullDescription}
              errorMessage={errors.fullDescription}
              isRequired
            />

            <div className="flex flex-col gap-2">
              <Select
                label="Cuisine"
                placeholder="Select a cuisine type"
                selectedKeys={form.cuisineTag ? [form.cuisineTag] : []}
                onSelectionChange={(keys) => {
                  const val = Array.from(keys as Set<string>)[0] as string;
                  setUserOverrodeCuisine(true);
                  updateField('cuisineTag', val || '');
                }}
                isInvalid={!!errors.cuisineTag}
                errorMessage={errors.cuisineTag}
                isRequired
              >
                {CUISINE_TAGS.map((tag) => (
                  <SelectItem key={tag}>{tag}</SelectItem>
                ))}
              </Select>

              {isClassifying && (
                <AgentLoadingState agentName="Food Classification" />
              )}

              {!isClassifying && classification && !userOverrodeCuisine && form.cuisineTag === classification.cuisineTag && (
                <div className="flex items-center gap-2 text-xs text-default-500">
                  <span>AI suggested</span>
                  <Chip size="sm" variant="flat" color="secondary">
                    {Math.round(classification.confidence * 100)}% confidence
                  </Chip>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Calories"
                type="number"
                placeholder="0"
                value={String(form.calories)}
                onValueChange={(v) => updateField('calories', Number(v) || 0)}
                isInvalid={!!errors.calories}
                errorMessage={errors.calories}
                isRequired
              />
              <Input
                label="Protein (g)"
                type="number"
                placeholder="0"
                value={String(form.protein)}
                onValueChange={(v) => updateField('protein', Number(v) || 0)}
                isInvalid={!!errors.protein}
                errorMessage={errors.protein}
                isRequired
              />
              <Input
                label="Carbs (g)"
                type="number"
                placeholder="0"
                value={String(form.carbs)}
                onValueChange={(v) => updateField('carbs', Number(v) || 0)}
                isInvalid={!!errors.carbs}
                errorMessage={errors.carbs}
                isRequired
              />
            </div>

            <Input
              label="Fat (g)"
              type="number"
              placeholder="0"
              value={String(form.fat)}
              onValueChange={(v) => updateField('fat', Number(v) || 0)}
              isInvalid={!!errors.fat}
              errorMessage={errors.fat}
              isRequired
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-default-700">
                Meal Image <span className="text-default-400">(optional)</span>
              </label>
              {imageUrl ? (
                <div className="flex items-center gap-3">
                  <img
                    src={imageUrl}
                    alt="Uploaded meal"
                    className="w-20 h-20 object-cover rounded-lg border border-default-200"
                  />
                  <Button
                    size="sm"
                    variant="flat"
                    color="danger"
                    onPress={() => setImageUrl('')}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
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
              )}
            </div>

            {serverError && (
              <div className="p-3 rounded-lg bg-danger-50 dark:bg-danger-500/10 text-danger text-sm">
                {serverError}
              </div>
            )}

            <Button
              type="submit"
              color="primary"
              size="lg"
              isLoading={isSubmitting}
              isDisabled={isUploading}
              className="w-full"
            >
              Create Meal
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
