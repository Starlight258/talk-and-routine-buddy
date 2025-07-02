
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { DashboardStats, MotivationMessage } from './types';

interface MotivationCardProps {
  stats: DashboardStats;
}

const getMotivationMessage = (successRate: number): MotivationMessage => {
  if (successRate >= 80) {
    return { message: "🔥 완벽해요! 이 기세로 계속 가봐요!", color: "text-green-600" };
  } else if (successRate >= 60) {
    return { message: "✨ 잘하고 있어요! 조금만 더 힘내봐요!", color: "text-blue-600" };
  } else if (successRate >= 40) {
    return { message: "💪 괜찮아요, 꾸준히 하는 게 중요해요!", color: "text-orange-600" };
  } else {
    return { message: "🌱 새로운 시작이에요. 하루씩 쌓아가봐요!", color: "text-indigo-600" };
  }
};

const MotivationCard = ({ stats }: MotivationCardProps) => {
  const motivation = getMotivationMessage(stats.successRate);

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50">
      <CardContent className="p-6 text-center">
        <h3 className={`text-lg font-semibold ${motivation.color} mb-2`}>
          {motivation.message}
        </h3>
        <p className="text-gray-600">
          지금까지 {stats.completedDays}일을 성공적으로 완료했어요!
        </p>
      </CardContent>
    </Card>
  );
};

export default MotivationCard;
