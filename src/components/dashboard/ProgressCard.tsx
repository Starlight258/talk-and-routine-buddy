
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from 'lucide-react';
import { DashboardStats } from './types';

interface ProgressCardProps {
  stats: DashboardStats;
}

const ProgressCard = ({ stats }: ProgressCardProps) => {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          전체 진행률
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">목표 달성률</span>
              <span className="text-sm font-medium">{stats.successRate}%</span>
            </div>
            <Progress value={stats.successRate} className="h-3" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <p className="text-gray-600">시작한 지</p>
              <p className="font-semibold">{stats.totalDays}일</p>
            </div>
            <div>
              <p className="text-gray-600">성공한 날</p>
              <p className="font-semibold text-green-600">{stats.completedDays}일</p>
            </div>
            <div>
              <p className="text-gray-600">이번 주</p>
              <p className="font-semibold text-blue-600">{stats.thisWeekSuccess}일</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
