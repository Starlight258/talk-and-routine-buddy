
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from 'lucide-react';
import GoalBasicInfo from './goal-setup/GoalBasicInfo';
import GoalScheduleSetup from './goal-setup/GoalScheduleSetup';
import GoalCriteriaStep from './goal-setup/GoalCriteriaStep';
import { Goal, GoalSetupProps } from './goal-setup/types';

const GoalSetup = ({ onGoalSet, existingGoal = null, isEditing = false }: GoalSetupProps) => {
  const [goal, setGoal] = useState<Goal>({
    title: existingGoal?.title || '',
    description: existingGoal?.description || '',
    frequency: existingGoal?.frequency || 'daily',
    duration: existingGoal?.duration || 30,
    time: existingGoal?.time || '08:00',
    difficulty: existingGoal?.difficulty || 'medium',
    successCriteria: existingGoal?.successCriteria || []
  });

  const [step, setStep] = useState(1);

  const handleGoalChange = (updates: Partial<Goal>) => {
    setGoal(prev => ({ ...prev, ...updates }));
  };

  const handleCriteriaSet = (criteria: any[]) => {
    setGoal(prev => ({ ...prev, successCriteria: criteria }));
  };

  const handleSubmit = () => {
    const routineData: Goal = {
      ...goal,
      id: existingGoal?.id || Date.now(),
      createdAt: existingGoal?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      streak: existingGoal?.streak || 0,
      totalDays: existingGoal?.totalDays || 0,
      successRate: existingGoal?.successRate || 0
    };
    
    onGoalSet(routineData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Target className="w-6 h-6 text-indigo-600" />
            {isEditing ? '목표 수정하기' : '목표 설정하기'}
          </CardTitle>
          <p className="text-gray-600">
            {isEditing ? '기존 목표를 수정하거나 새로운 목표를 설정해보세요' : 'AI가 당신의 목표를 실현 가능한 루틴으로 만들어드려요'}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <GoalBasicInfo
              goal={goal}
              onGoalChange={handleGoalChange}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <GoalScheduleSetup
              goal={goal}
              onGoalChange={handleGoalChange}
              onPrevious={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}

          {step === 3 && (
            <GoalCriteriaStep
              successCriteria={goal.successCriteria}
              onCriteriaSet={handleCriteriaSet}
              onPrevious={() => setStep(2)}
              onSubmit={handleSubmit}
              isEditing={isEditing}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalSetup;
