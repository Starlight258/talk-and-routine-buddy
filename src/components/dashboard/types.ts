
export interface DashboardStats {
  totalDays: number;
  completedDays: number;
  currentStreak: number;
  longestStreak: number;
  successRate: number;
  thisWeekSuccess: number;
}

export interface WeeklyData {
  week: string;
  successRate: number;
  completed: number;
  total: number;
}

export interface DailyData {
  day: string;
  completed: number;
  date: string;
}

export interface MotivationMessage {
  message: string;
  color: string;
}
