'use client';

import { Accordion, Card, Chip, Separator } from '@heroui/react';
import type { MealPlanDay } from '@/lib/types/mealplan';

function MacroBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-[#849A95] dark:text-[#6E8883] w-14">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-[#EEF7F3] dark:bg-[#1b2b28]">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${Math.min(value / 3, 100)}%` }}
        />
      </div>
      <span className="text-xs font-semibold w-10 text-right text-[#163330] dark:text-[#E8F2EF]">{value}g</span>
    </div>
  );
}

interface DayCardProps {
  day: MealPlanDay;
  dateLabel?: string;
}

export function DayCard({ day, dateLabel }: DayCardProps) {
  return (
    <Card className="rounded-2xl border border-[#DCE9E4] dark:border-[#263835] bg-white dark:bg-[#161f1e] shadow-sm">
      <Card.Header className="pb-2 pt-4 px-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#DDF5F0] dark:bg-[#007F78]/25 text-[#007F78] dark:text-[#2DD4BF] font-bold text-sm">
            {day.day}
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-[#163330] dark:text-[#E8F2EF]">Day {day.day}</h3>
            {dateLabel && <span className="text-xs text-[#849A95] dark:text-[#6E8883]">{dateLabel}</span>}
          </div>
        </div>
      </Card.Header>
      <Card.Content className="px-5 pb-5">
        <Accordion>
          {day.meals.map((meal, i) => (
            <Accordion.Item key={i} id={`${day.day}-${i}`}>
              <Accordion.Heading>
                <Accordion.Trigger>
                  <div className="flex items-center justify-between w-full pr-4">
                    <span className="font-medium text-[#163330] dark:text-[#E8F2EF]">{meal.name}</span>
                    <Chip size="sm" className="bg-[#DDF5F0] dark:bg-[#007F78]/25 text-[#007F78] dark:text-[#2DD4BF] border-none font-medium">
                      {meal.calories} cal
                    </Chip>
                  </div>
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <MacroBar label="Protein" value={meal.macros.protein} color="bg-[#007F78]" />
                      <MacroBar label="Carbs" value={meal.macros.carbs} color="bg-[#F59E0B]" />
                      <MacroBar label="Fat" value={meal.macros.fat} color="bg-[#EF4444]" />
                    </div>

                    <Separator className="bg-[#DCE9E4] dark:bg-[#263835]" />

                    <div>
                      <h4 className="text-xs font-semibold text-[#849A95] dark:text-[#6E8883] uppercase tracking-wide mb-1.5">
                        Ingredients
                      </h4>
                      <ul className="flex flex-wrap gap-1.5">
                        {meal.ingredients.map((ing, j) => (
                          <Chip key={j} size="sm" className="bg-[#EEF7F3] dark:bg-[#1b2b28] text-[#163330] dark:text-[#E8F2EF] border border-[#DCE9E4] dark:border-[#263835]">
                            {ing}
                          </Chip>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-[#849A95] dark:text-[#6E8883] uppercase tracking-wide mb-1.5">
                        Instructions
                      </h4>
                      <p className="text-sm text-[#55706B] dark:text-[#A1B8B3] leading-relaxed">
                        {meal.instructions}
                      </p>
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Card.Content>
    </Card>
  );
}