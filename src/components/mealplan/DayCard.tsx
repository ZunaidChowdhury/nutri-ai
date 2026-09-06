'use client';

import { Accordion, Card, Chip, Separator } from '@heroui/react';
import type { MealPlanDay } from '@/lib/types/mealplan';

function MacroBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-muted w-14">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-surface-secondary dark:bg-surface-secondary">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${Math.min(value / 3, 100)}%` }}
        />
      </div>
      <span className="text-xs font-semibold w-10 text-right">{value}g</span>
    </div>
  );
}

interface DayCardProps {
  day: MealPlanDay;
  dateLabel?: string;
}

export function DayCard({ day, dateLabel }: DayCardProps) {
  return (
    <Card className="border border-border dark:border-border">
      <Card.Header className="pb-2 pt-4 px-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-accent-soft dark:bg-accent-soft text-accent font-bold text-sm">
            {day.day}
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">Day {day.day}</h3>
            {dateLabel && <span className="text-xs text-muted">{dateLabel}</span>}
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
                    <span className="font-medium">{meal.name}</span>
                    <Chip size="sm" variant="soft" color="accent">
                      {meal.calories} cal
                    </Chip>
                  </div>
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <MacroBar label="Protein" value={meal.macros.protein} color="bg-danger" />
                      <MacroBar label="Carbs" value={meal.macros.carbs} color="bg-warning" />
                      <MacroBar label="Fat" value={meal.macros.fat} color="bg-accent" />
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">
                        Ingredients
                      </h4>
                      <ul className="flex flex-wrap gap-1.5">
                        {meal.ingredients.map((ing, j) => (
                          <Chip key={j} size="sm" variant="soft" color="default">
                            {ing}
                          </Chip>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">
                        Instructions
                      </h4>
                      <p className="text-sm text-default dark:text-muted leading-relaxed">
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