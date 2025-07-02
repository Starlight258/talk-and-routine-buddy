
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Award, Target, CheckCircle } from 'lucide-react';
import { DashboardStats } from './types';

interface StatsCardsProps {
  stats: DashboardStats;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4 text-center">
          <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-orange-600">{stats.currentStreak}</p>
          <p className="text-sm text-gray-600">현재 연속</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-4 text-center">
          <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-yellow-600">{stats.longestStreak}</p>
          <p className="text-sm text-gray-600">최고 기록</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-4 text-center">
          <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-green-600">{stats.successRate}%</p>
          <p className="text-sm text-gray-600">성공률</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-4 text-center">
          <CheckCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-blue-600">{stats.completedDays}</p>
          <p className="text-sm text-gray-600">총 완료일</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
