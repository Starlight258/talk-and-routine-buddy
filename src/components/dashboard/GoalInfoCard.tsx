
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from 'lucide-react';

interface GoalInfoCardProps {
  goal: any;
}

const GoalInfoCard = ({ goal }: GoalInfoCardProps) => {
  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily': return '매일';
      case 'weekdays': return '주중';
      case 'alternate': return '격일';
      case 'weekly': return '주 3회';
      default: return frequency;
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          현재 목표 정보
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">목표</span>
            <span className="font-medium">{goal?.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">소요 시간</span>
            <span className="font-medium">{goal?.duration}분</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">빈도</span>
            <Badge variant="secondary">
              {getFrequencyText(goal?.frequency)}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">시작 시간</span>
            <span className="font-medium">{goal?.time}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalInfoCard;
