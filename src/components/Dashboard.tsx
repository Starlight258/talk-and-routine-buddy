
import React, { useState, useEffect } from 'react';
import MotivationCard from './dashboard/MotivationCard';
import StatsCards from './dashboard/StatsCards';
import ProgressCard from './dashboard/ProgressCard';
import WeeklyTrendChart from './dashboard/WeeklyTrendChart';
import DailyPerformanceChart from './dashboard/DailyPerformanceChart';
import GoalInfoCard from './dashboard/GoalInfoCard';
import { calculateStats, loadWeeklyData, loadDailyData } from './dashboard/StatsCalculator';
import { DashboardStats, WeeklyData, DailyData } from './dashboard/types';

const Dashboard = ({ goal }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalDays: 0,
    completedDays: 0,
    currentStreak: 0,
    longestStreak: 0,
    successRate: 0,
    thisWeekSuccess: 0
  });
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [monthlyData, setMonthlyData] = useState<DailyData[]>([]);

  useEffect(() => {
    setStats(calculateStats());
    setWeeklyData(loadWeeklyData());
    setMonthlyData(loadDailyData());
  }, [goal]);

  return (
    <div className="space-y-6">
      <MotivationCard stats={stats} />
      <StatsCards stats={stats} />
      <ProgressCard stats={stats} />
      <WeeklyTrendChart data={weeklyData} />
      <DailyPerformanceChart data={monthlyData} />
      <GoalInfoCard goal={goal} />
    </div>
  );
};

export default Dashboard;
