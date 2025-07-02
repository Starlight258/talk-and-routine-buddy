
export interface Goal {
  id?: number;
  title: string;
  description: string;
  frequency: string;
  duration: number;
  time: string;
  difficulty: string;
  successCriteria: any[];
  createdAt?: string;
  updatedAt?: string;
  streak?: number;
  totalDays?: number;
  successRate?: number;
}

export interface GoalSetupProps {
  onGoalSet: (goal: Goal) => void;
  existingGoal?: Goal | null;
  isEditing?: boolean;
}
