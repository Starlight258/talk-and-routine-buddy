
import React from 'react';
import { Button } from "@/components/ui/button";
import SuccessCriteriaSetup from '../SuccessCriteriaSetup';

interface GoalCriteriaStepProps {
  successCriteria: any[];
  onCriteriaSet: (criteria: any[]) => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isEditing: boolean;
}

const GoalCriteriaStep = ({ successCriteria, onCriteriaSet, onPrevious, onSubmit, isEditing }: GoalCriteriaStepProps) => {
  const handleCriteriaSet = (criteria: any[]) => {
    onCriteriaSet(criteria);
    // Don't auto-advance to next step, just update the criteria
  };

  return (
    <div className="space-y-6">
      <SuccessCriteriaSetup 
        onCriteriaSet={handleCriteriaSet}
        initialCriteria={successCriteria}
      />
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          className="flex-1"
        >
          이전
        </Button>
        <Button 
          onClick={onSubmit}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          size="lg"
        >
          {isEditing ? '목표 수정하기' : '루틴 시작하기'}
        </Button>
      </div>
    </div>
  );
};

export default GoalCriteriaStep;
