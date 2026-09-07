import { jsPDF } from 'jspdf';
import autoTable, { type HookData } from 'jspdf-autotable';
import type { MealPlan } from '@/lib/types/mealplan';

const ACCENT: [number, number, number] = [16, 163, 82];
const BORDER: [number, number, number] = [222, 226, 230];

const GOAL_LABELS: Record<string, string> = {
  lose: 'Weight Loss',
  maintain: 'Maintain Weight',
  gain: 'Weight Gain / Muscle Building',
};

const BUDGET_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

function formatDayDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function downloadMealPlanPdf(plan: MealPlan) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const start = plan.createdAt ? new Date(plan.createdAt) : new Date();

  doc.setFontSize(20);
  doc.setTextColor(22, 22, 22);
  doc.text('NutriAI - 7-Day Meal Plan', 40, 44);
  doc.setFontSize(10);
  doc.setTextColor(110);
  doc.text(`Generated ${formatDayDate(start)}`, 40, 60);

  const totalCalories = plan.days.reduce(
    (sum, d) => sum + d.meals.reduce((s, m) => s + m.calories, 0),
    0
  );
  const avgCalories = plan.days.length ? Math.round(totalCalories / plan.days.length) : 0;
  const goalLabel = GOAL_LABELS[plan.inputs.goal] || plan.inputs.goal;
  const budgetLabel = BUDGET_LABELS[plan.inputs.budget] || plan.inputs.budget;
  const restrictions = plan.inputs.restrictions?.length
    ? plan.inputs.restrictions.join(', ')
    : 'none';
  const sourceLabel = plan.inputs.source === 'selected' ? 'Selected meals' : 'Random meals';

  doc.setFontSize(9);
  doc.setTextColor(60);
  doc.text(
    `Goal: ${goalLabel}   Budget: ${budgetLabel}   Target: ${plan.inputs.calorieTarget} cal/day   Restrictions: ${restrictions}   Avg: ${avgCalories} cal/day   Source: ${sourceLabel}`,
    40,
    78
  );

  let y = 104;

  plan.days.forEach((day) => {
    const dayDate = new Date(start);
    dayDate.setDate(start.getDate() + (day.day - 1));

    if (y > 720) {
      doc.addPage();
      y = 40;
    }

    doc.setFontSize(13);
    doc.setTextColor(22, 22, 22);
    doc.text(`Day ${day.day} - ${formatDayDate(dayDate)}`, 40, y);
    y += 14;

    let tableEndY = y;
    autoTable(doc, {
      startY: y,
      margin: { left: 40, right: 40 },
      head: [['Meal', 'Cal', 'P', 'C', 'F', 'Ingredients', 'Instructions']],
      body: day.meals.map((m) => [
        m.name,
        String(m.calories),
        `${m.macros.protein}g`,
        `${m.macros.carbs}g`,
        `${m.macros.fat}g`,
        m.ingredients.join(', '),
        m.instructions,
      ]),
      styles: {
        fontSize: 8,
        cellPadding: 4,
        valign: 'top',
        lineColor: BORDER,
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: ACCENT,
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 28 },
        2: { cellWidth: 24 },
        3: { cellWidth: 24 },
        4: { cellWidth: 24 },
      },
      didDrawPage: (data: HookData) => {
        if (data.cursor) tableEndY = data.cursor.y;
      },
    });

    y = tableEndY + 24;
  });

  doc.save(`nutriai-meal-plan-${start.toISOString().slice(0, 10)}.pdf`);
}