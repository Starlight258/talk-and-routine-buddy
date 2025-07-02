
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Clock, Calendar, Sparkles } from 'lucide-react';
import SuccessCriteriaSetup from './SuccessCriteriaSetup';

const GoalSetup = ({ onGoalSet, existingGoal = null, isEditing = false }) => {
  const [goal, setGoal] = useState({
    title: existingGoal?.title || '',
    description: existingGoal?.description || '',
    frequency: existingGoal?.frequency || 'daily',
    duration: existingGoal?.duration || 30,
    time: existingGoal?.time || '08:00',
    difficulty: existingGoal?.difficulty || 'medium',
    successCriteria: existingGoal?.successCriteria || []
  });

  const [step, setStep] = useState(1);

  const handleSuccessCriteria = (criteria) => {
    setGoal(prev => ({ ...prev, successCriteria: criteria }));
    setStep(3);
  };

  const handleSubmit = () => {
    const routineData = {
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

  const suggestions = [
    { title: "매일 30분 운동하기", description: "건강한 몸을 위해 꾸준히 운동해요", duration: 30 },
    { title: "독서 습관 만들기", description: "매일 책을 읽으며 지식을 쌓아요", duration: 20 },
    { title: "명상과 마음챙김", description: "마음의 평안을 위한 시간을 가져요", duration: 15 },
    { title: "새로운 언어 학습", description: "조금씩 꾸준히 새로운 언어를 배워요", duration: 25 },
  ];

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
            <div className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-base font-medium">어떤 목표를 달성하고 싶으세요?</Label>
                <Input
                  id="title"
                  placeholder="예: 매일 30분 운동하기"
                  value={goal.title}
                  onChange={(e) => setGoal(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-2 text-lg p-4"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-base font-medium">목표에 대해 더 자세히 설명해주세요</Label>
                <Textarea
                  id="description"
                  placeholder="이 목표가 왜 중요한지, 어떻게 달성하고 싶은지 알려주세요"
                  value={goal.description}
                  onChange={(e) => setGoal(prev => ({ ...prev, description: e.target.value }))}
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
                        onClick={() => setGoal(prev => ({ 
                          ...prev, 
                          title: suggestion.title, 
                          description: suggestion.description,
                          duration: suggestion.duration
                        }))}
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
                onClick={() => setStep(2)} 
                disabled={!goal.title}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                size="lg"
              >
                다음 단계로
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    얼마나 자주 하실 건가요?
                  </Label>
                  <Select value={goal.frequency} onValueChange={(value) => setGoal(prev => ({ ...prev, frequency: value }))}>
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
                    onChange={(e) => setGoal(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
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
                    onChange={(e) => setGoal(prev => ({ ...prev, time: e.target.value }))}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    시작 난이도
                  </Label>
                  <Select value={goal.difficulty} onValueChange={(value) => setGoal(prev => ({ ...prev, difficulty: value }))}>
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
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  이전
                </Button>
                <Button 
                  onClick={() => setStep(3)}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  size="lg"
                >
                  성공 기준 설정하기
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <SuccessCriteriaSetup 
                onCriteriaSet={handleSuccessCriteria}
                initialCriteria={goal.successCriteria}
              />
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(2)}
                  className="flex-1"
                >
                  이전
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  size="lg"
                >
                  {isEditing ? '목표 수정하기' : '루틴 시작하기'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalSetup;
