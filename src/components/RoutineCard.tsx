
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Flame, Settings, Trash2, MessageSquare } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import ReflectionModal from './ReflectionModal';

const RoutineCard = ({ routine, onUpdate, onDelete }) => {
  const [todayStatus, setTodayStatus] = useState(null);
  const [streak, setStreak] = useState(routine.streak || 0);
  const [showReflection, setShowReflection] = useState(false);
  const [completionType, setCompletionType] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadTodayStatus();
  }, [routine.id]);

  const loadTodayStatus = () => {
    const today = new Date().toDateString();
    const savedStatus = localStorage.getItem(`routine_${routine.id}_${today}`);
    setTodayStatus(savedStatus);
  };

  const handleComplete = () => {
    const today = new Date().toDateString();
    localStorage.setItem(`routine_${routine.id}_${today}`, 'completed');
    setTodayStatus('completed');
    setStreak(prev => prev + 1);
    setCompletionType('completed');
    setShowReflection(true);
    
    toast({
      title: "루틴 완료! 🎉",
      description: `${routine.title} 완료했어요!`,
    });

    // 루틴 업데이트
    onUpdate({
      ...routine,
      streak: streak + 1,
      totalDays: (routine.totalDays || 0) + 1
    });
  };

  const handleSkip = () => {
    const today = new Date().toDateString();
    localStorage.setItem(`routine_${routine.id}_${today}`, 'skipped');
    setTodayStatus('skipped');
    setStreak(0);
    setCompletionType('skipped');
    setShowReflection(true);
    
    toast({
      title: "오늘은 쉬어가요",
      description: "괜찮아요, 내일 다시 시작해봐요!",
    });

    // 루틴 업데이트
    onUpdate({
      ...routine,
      streak: 0
    });
  };

  const handleReflectionComplete = (reflection, aiResponse) => {
    // 소감과 AI 응답을 저장
    const today = new Date().toDateString();
    const reflectionData = {
      date: today,
      routineId: routine.id,
      reflection,
      aiResponse,
      status: completionType
    };
    
    const existingReflections = JSON.parse(localStorage.getItem('reflections') || '[]');
    existingReflections.push(reflectionData);
    localStorage.setItem('reflections', JSON.stringify(existingReflections));
    
    setShowReflection(false);
  };

  const getColorClass = (color) => {
    return color || 'bg-indigo-500';
  };

  return (
    <>
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className={`h-2 ${getColorClass(routine.color)}`}></div>
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-800 mb-1">
                {routine.title}
              </CardTitle>
              <p className="text-sm text-gray-600 line-clamp-2">
                {routine.description}
              </p>
            </div>
            <div className="flex gap-1 ml-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                onClick={() => onDelete(routine.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* 루틴 정보 */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{routine.duration}분</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="font-medium text-orange-600">{streak}일 연속</span>
              </div>
            </div>

            {/* 시간 및 빈도 */}
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-xs">
                {routine.time}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {routine.frequency === 'daily' && '매일'}
                {routine.frequency === 'weekdays' && '주중'}
                {routine.frequency === 'alternate' && '격일'}
                {routine.frequency === 'weekly' && '주 3회'}
              </Badge>
            </div>

            {/* 오늘 상태 */}
            {todayStatus ? (
              <div className="text-center">
                {todayStatus === 'completed' ? (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1" />
                    <p className="text-sm text-green-700 font-medium">완료!</p>
                  </div>
                ) : (
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <XCircle className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                    <p className="text-sm text-orange-700 font-medium">쉬는 날</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Button 
                  onClick={handleComplete}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  size="sm"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  완료
                </Button>
                <Button 
                  onClick={handleSkip}
                  variant="outline"
                  className="flex-1 border-orange-300 text-orange-600 hover:bg-orange-50"
                  size="sm"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  패스
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ReflectionModal
        isOpen={showReflection}
        onClose={() => setShowReflection(false)}
        routine={routine}
        completionType={completionType}
        onComplete={handleReflectionComplete}
      />
    </>
  );
};

export default RoutineCard;
