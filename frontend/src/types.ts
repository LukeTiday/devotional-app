export type PlanSummary = {
  id: number;
  title: string;
  slug: string;
  description: string;
  image_url: string | null;
};

export type PlanStep = {
  id: number;
  step_key: string;
  step_order: number;
  step_type: string;
  content_markdown: string | null;
  scripture_reference: string | null;
};

export type PlanDay = {
  id: number;
  day_number: number;
  title: string;
  steps: PlanStep[];
};

export type Plan = PlanSummary & {
  days: PlanDay[];
};