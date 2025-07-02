
import { DashboardStats, WeeklyData, DailyData } from './types';

export const calculateStats = (): DashboardStats => {
  const today = new Date();
  let totalDays = 0;
  let completedDays = 0;
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let thisWeekSuccess = 0;

  // 지난 30일 데이터 분석
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toDateString();
    const status = localStorage.getItem(`routine_${dateStr}`);
    
    if (status) {
      totalDays++;
      if (status === 'completed') {
        completedDays++;
        tempStreak++;
        if (i <= 7) thisWeekSuccess++; // 지난 7일
      } else {
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        tempStreak = 0;
      }
    }
    
    // 현재 연속 기록 계산 (오늘부터 거꾸로)
    if (i === 0) {
      if (status === 'completed') {
        currentStreak = 1;
        for (let j = 1; j < 30; j++) {
          const prevDate = new Date(today);
          prevDate.setDate(prevDate.getDate() - j);
          const prevStatus = localStorage.getItem(`routine_${prevDate.toDateString()}`);
          if (prevStatus === 'completed') {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }
  }

  const successRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  return {
    totalDays,
    completedDays,
    currentStreak,
    longestStreak: Math.max(longestStreak, tempStreak),
    successRate,
    thisWeekSuccess
  };
};

export const loadWeeklyData = (): WeeklyData[] => {
  const today = new Date();
  const weekly = [];
  
  for (let week = 3; week >= 0; week--) {
    let weekSuccess = 0;
    let weekTotal = 0;
    
    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (week * 7 + day));
      const status = localStorage.getItem(`routine_${date.toDateString()}`);
      
      if (status) {
        weekTotal++;
        if (status === 'completed') weekSuccess++;
      }
    }
    
    weekly.push({
      week: `${week + 1}주 전`,
      successRate: weekTotal > 0 ? Math.round((weekSuccess / weekTotal) * 100) : 0,
      completed: weekSuccess,
      total: weekTotal
    });
  }
  
  return weekly.reverse();
};

export const loadDailyData = (): DailyData[] => {
  const today = new Date();
  const daily = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const status = localStorage.getItem(`routine_${date.toDateString()}`);
    
    daily.push({
      day: date.toLocaleDateString('ko-KR', { weekday: 'short' }),
      completed: status === 'completed' ? 1 : 0,
      date: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
    });
  }
  
  return daily;
};
