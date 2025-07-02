
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Calendar, Sparkles } from 'lucide-react';

interface GoalScheduleSetupProps {
  goal: {
    frequency: string;
    duration: number;
    time: string;
    difficulty: string;
  };
  onGoalChange: (updates: Partial<{ frequency: string; duration: number; time: string; difficulty: string }>) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const GoalScheduleSetup = ({ goal, onGoalChange, onPrevious, onNext }: GoalScheduleSetupProps) => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="text-base font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            얼마나 자주 하실 건가요?
          </Label>
          <Select value={goal.frequency} onValueChange={(value) => onGoalChange({ frequency: value })}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">매일</SelectItem>
              <SelectItem value="weekdays">주중 (월~금)</SelectItem>
              <SelectItem value="alternate">격일</SelectItem>
              <SelectItem value="weekly">주 3회</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-base font-medium flex items-center gap-2">
            <Clock className="w-4 h-4" />
            몇 분 정도 할까요?
          </Label>
          <Input
            type="number"
            min="5"
            max="180"
            value={goal.duration}
            onChange={(e) => onGoalChange({ duration: parseInt(e.target.value) })}
            className="mt-2"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="text-base font-medium">선호하는 시간대</Label>
          <Input
            type="time"
            value={goal.time}
            onChange={(e) => onGoalChange({ time: e.target.value })}
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-base font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            시작 난이도
          </Label>
          <Select value={goal.difficulty} onValueChange={(value) => onGoalChange({ difficulty: value })}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">쉽게 (부담 없이)</SelectItem>
              <SelectItem value="medium">적당히 (조금 도전적으로)</SelectItem>
              <SelectItem value="hard">열심히 (확실하게)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          className="flex-1"
        >
          이전
        </Button>
        <Button 
          onClick={onNext}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          size="lg"
        >
          성공 기준 설정하기
        </Button>
      </div>
    </div>
  );
};

export default GoalScheduleSetup;
