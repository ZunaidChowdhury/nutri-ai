'use client';

import { Accordion, Card, Chip, Separator } from '@heroui/react';
import type { MealPlanDay } from '@/lib/types/mealplan';

function MacroBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-[#849A95] dark:text-[#6E8883] w-14">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-[#EEF7F3] dark:bg-[#1b2b28] overflow-hidden">
        <div
          className={`h-2 rounded-full ${color} transition-all duration-300`}
          style={{ width: `${Math.min(value / 2.5, 100)}%` }}
        />
      </div>
      <span className="text-xs font-bold w-12 text-right text-[#163330] dark:text-[#E8F2EF]">{value}g</span>
    </div>
  );
}

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack / Additional'];

interface DayCardProps {
  day: MealPlanDay;
  dateLabel?: string;
}

export function DayCard({ day, dateLabel }: DayCardProps) {
  const dayCalories = day.meals.reduce((sum, m) => sum + (m.calories || 0), 0);
  const dayProtein = day.meals.reduce((sum, m) => sum + (m.macros?.protein || 0), 0);
  const dayCarbs = day.meals.reduce((sum, m) => sum + (m.macros?.carbs || 0), 0);
  const dayFat = day.meals.reduce((sum, m) => sum + (m.macros?.fat || 0), 0);

  return (
    <Card className="rounded-2xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] shadow-sm transition-all hover:shadow-md">
      <Card.Header className="pb-3 pt-5 px-5 sm:px-6 border-b border-[#DCE9E4]/60 dark:border-[#263835]/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#DDF5F0] dark:bg-[#007F78]/25 text-[#007F78] dark:text-[#2DD4BF] font-extrabold text-base shadow-2xs">
              {day.day}
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-[#163330] dark:text-[#E8F2EF]">Day {day.day}</h3>
              {dateLabel ? (
                <span className="text-xs text-[#849A95] dark:text-[#6E8883]">{dateLabel}</span>
              ) : (
                <span className="text-xs text-[#55706B] dark:text-[#A1B8B3]">
                  {day.meals.length} planned meal{day.meals.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Chip size="sm" className="bg-[#FEF3C7] dark:bg-[#F59E0B]/20 text-[#92400E] dark:text-[#FCD34D] border-none font-bold">
              ⚡ {dayCalories} kcal
            </Chip>
            <div className="hidden sm:flex items-center gap-1.5 text-xs">
              <span className="px-2 py-0.5 rounded-md bg-[#DDF5F0] dark:bg-[#007F78]/25 text-[#007F78] dark:text-[#2DD4BF] font-semibold">
                P: {dayProtein}g
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#FEF3C7] dark:bg-[#F59E0B]/20 text-[#92400E] dark:text-[#FCD34D] font-semibold">
                C: {dayCarbs}g
              </span>
              <span className="px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-semibold">
                F: {dayFat}g
              </span>
            </div>
          </div>
        </div>
      </Card.Header>

      <Card.Content className="px-5 sm:px-6 pb-5 pt-3">
        <Accordion>
          {day.meals.map((meal, i) => {
            const mealType = MEAL_TYPES[i] || `Meal ${i + 1}`;
            return (
              <Accordion.Item key={i} id={`${day.day}-${i}`} className="border-b border-[#DCE9E4]/40 dark:border-[#263835]/40 last:border-b-0 py-1">
                <Accordion.Heading>
                  <Accordion.Trigger className="cursor-pointer">
                    <div className="flex items-center justify-between w-full pr-4 gap-2">
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#EEF7F3] dark:bg-[#1b2b28] text-[#007F78] dark:text-[#2DD4BF] flex-shrink-0">
                          {mealType}
                        </span>
                        <span className="font-semibold text-[#163330] dark:text-[#E8F2EF] truncate text-sm sm:text-base">
                          {meal.name}
                        </span>
                      </div>
                      <Chip size="sm" className="bg-[#DDF5F0] dark:bg-[#007F78]/25 text-[#007F78] dark:text-[#2DD4BF] border-none font-bold flex-shrink-0">
                        {meal.calories} cal
                      </Chip>
                    </div>
                  </Accordion.Trigger>
                </Accordion.Heading>
                <Accordion.Panel>
                  <Accordion.Body>
                    <div className="flex flex-col gap-4 pt-1 pb-2">
                      <div className="rounded-xl border border-[#DCE9E4] dark:border-[#263835] bg-[#F7FAF8] dark:bg-[#1b2b28] p-3 flex flex-col gap-1.5">
                        <MacroBar label="Protein" value={meal.macros.protein} color="bg-[#007F78]" />
                        <MacroBar label="Carbs" value={meal.macros.carbs} color="bg-[#F59E0B]" />
                        <MacroBar label="Fat" value={meal.macros.fat} color="bg-[#EF4444]" />
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-[#849A95] dark:text-[#6E8883] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <span>Ingredients</span>
                          <span className="text-[10px] font-normal lowercase text-[#849A95]">({meal.ingredients.length})</span>
                        </h4>
                        <ul className="flex flex-wrap gap-1.5">
                          {meal.ingredients.map((ing, j) => (
                            <Chip key={j} size="sm" className="bg-[#EEF7F3] dark:bg-[#121918] text-[#163330] dark:text-[#E8F2EF] border border-[#DCE9E4] dark:border-[#263835] font-medium">
                              {ing}
                            </Chip>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-xl border border-[#DCE9E4]/60 dark:border-[#263835]/60 bg-white dark:bg-[#121918] p-3.5">
                        <h4 className="text-xs font-bold text-[#849A95] dark:text-[#6E8883] uppercase tracking-wider mb-1.5">
                          Preparation Instructions
                        </h4>
                        <p className="text-xs sm:text-sm text-[#55706B] dark:text-[#A1B8B3] leading-relaxed">
                          {meal.instructions}
                        </p>
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Panel>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </Card.Content>
    </Card>
  );
}