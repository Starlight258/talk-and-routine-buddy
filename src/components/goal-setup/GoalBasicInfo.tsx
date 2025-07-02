
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface GoalBasicInfoProps {
  goal: {
    title: string;
    description: string;
  };
  onGoalChange: (updates: Partial<{ title: string; description: string; duration: number }>) => void;
  onNext: () => void;
}

const GoalBasicInfo = ({ goal, onGoalChange, onNext }: GoalBasicInfoProps) => {
  const suggestions = [
    { title: "매일 30분 운동하기", description: "건강한 몸을 위해 꾸준히 운동해요", duration: 30 },
    { title: "독서 습관 만들기", description: "매일 책을 읽으며 지식을 쌓아요", duration: 20 },
    { title: "명상과 마음챙김", description: "마음의 평안을 위한 시간을 가져요", duration: 15 },
    { title: "새로운 언어 학습", description: "조금씩 꾸준히 새로운 언어를 배워요", duration: 25 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title" className="text-base font-medium">어떤 목표를 달성하고 싶으세요?</Label>
        <Input
          id="title"
          placeholder="예: 매일 30분 운동하기"
          value={goal.title}
          onChange={(e) => onGoalChange({ title: e.target.value })}
          className="mt-2 text-lg p-4"
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-base font-medium">목표에 대해 더 자세히 설명해주세요</Label>
        <Textarea
          id="description"
          placeholder="이 목표가 왜 중요한지, 어떻게 달성하고 싶은지 알려주세요"
          value={goal.description}
          onChange={(e) => onGoalChange({ description: e.target.value })}
          className="mt-2"
          rows={3}
        />
      </div>

      {!goal.title && (
        <div>
          <Label className="text-base font-medium mb-3 block">💡 추천 목표</Label>
          <div className="grid gap-3">
            {suggestions.map((suggestion, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:bg-indigo-50 border-indigo-200 transition-colors"
                onClick={() => onGoalChange({ 
                  title: suggestion.title, 
                  description: suggestion.description,
                  duration: suggestion.duration
                })}
              >
                <CardContent className="p-4">
                  <h3 className="font-medium text-indigo-700">{suggestion.title}</h3>
                  <p className="text-sm text-gray-600">{suggestion.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Button 
        onClick={onNext} 
        disabled={!goal.title}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        size="lg"
      >
        다음 단계로
      </Button>
    </div>
  );
};

export default GoalBasicInfo;
