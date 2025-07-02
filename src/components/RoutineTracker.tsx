import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Flame, Target, MessageCircle, Calendar } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const RoutineTracker = ({ goal }) => {
  const [todayStatus, setTodayStatus] = useState(null);
  const [streak, setStreak] = useState(goal?.streak || 0);
  const [weeklyData, setWeeklyData] = useState([]);
  const [showAIResponse, setShowAIResponse] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadTodayStatus();
    loadWeeklyData();
  }, [goal]);

  const loadTodayStatus = () => {
    const today = new Date().toDateString();
    const savedStatus = localStorage.getItem(`routine_${today}`);
    setTodayStatus(savedStatus);
  };

  const loadWeeklyData = () => {
    const week = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const status = localStorage.getItem(`routine_${dateStr}`);
      week.push({
        date: dateStr,
        day: date.toLocaleDateString('ko-KR', { weekday: 'short' }),
        status: status
      });
    }
    setWeeklyData(week);
  };

  const handleComplete = () => {
    const today = new Date().toDateString();
    localStorage.setItem(`routine_${today}`, 'completed');
    setTodayStatus('completed');
    setStreak(prev => prev + 1);
    
    const aiMessages = [
      "🎉 훌륭해요! 오늘도 목표를 달성하셨네요. 조금씩 꾸준히 하는 게 정말 대단한 일이에요!",
      "✨ 완료! 이렇게 하나씩 쌓여가는 성공이 큰 변화를 만들어낼 거예요.",
      "🔥 멋져요! 오늘의 루틴 완료로 한 걸음 더 목표에 가까워졌어요.",
      "💪 대단해요! 꾸준함이 가장 큰 힘이라는 걸 보여주고 계시네요!",
    ];
    
    const randomMessage = aiMessages[Math.floor(Math.random() * aiMessages.length)];
    setAiMessage(randomMessage);
    setShowAIResponse(true);
    
    toast({
      title: "루틴 완료! 🎉",
      description: "오늘의 목표를 달성했어요!",
    });

    setTimeout(() => setShowAIResponse(false), 5000);
    loadWeeklyData();
  };

  const handleSkip = () => {
    const today = new Date().toDateString();
    localStorage.setItem(`routine_${today}`, 'skipped');
    setTodayStatus('skipped');
    
    const aiMessages = [
      "괜찮아요! 오늘은 힘들었죠? 완벽하지 않아도 돼요. 내일은 조금 더 쉽게 시작해볼까요?",
      "오늘 하루 쉬어가는 것도 필요해요. 너무 자책하지 마세요. 내일 다시 함께 해봐요!",
      "모든 날이 완벽할 순 없어요. 중요한 건 다시 시작하는 것이죠. 응원할게요! 💪",
      "오늘은 쉬어가도 괜찮아요. 지금까지 잘 해왔으니까 내일은 더 가볍게 시작해봐요.",
    ];
    
    const randomMessage = aiMessages[Math.floor(Math.random() * aiMessages.length)];
    setAiMessage(randomMessage);
    setShowAIResponse(true);
    
    toast({
      title: "오늘은 쉬어가요",
      description: "괜찮아요, 내일 다시 시작해봐요!",
    });

    setTimeout(() => setShowAIResponse(false), 5000);
    loadWeeklyData();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'skipped':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>;
    }
  };

  const getSuccessRate = () => {
    const completedDays = weeklyData.filter(day => day.status === 'completed').length;
    const totalDays = weeklyData.filter(day => day.status).length;
    return totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* AI 응답 메시지 */}
      {showAIResponse && (
        <Card className="border-l-4 border-l-indigo-500 bg-indigo-50 animate-in slide-in-from-top-2">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
              <p className="text-indigo-800">{aiMessage}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 오늘의 루틴 */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            오늘의 루틴
          </CardTitle>
          <p className="text-gray-600">{goal?.title}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="font-medium">{goal?.duration}분 동안</p>
                  <p className="text-sm text-gray-600">{goal?.time}에 시작 예정</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-bold text-orange-600">{streak}일 연속</span>
              </div>
            </div>

            {todayStatus ? (
              <div className="text-center space-y-2">
                {todayStatus === 'completed' ? (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-green-700 font-medium">오늘 루틴 완료! 🎉</p>
                    <p className="text-sm text-green-600">내일도 함께 해봐요!</p>
                  </div>
                ) : (
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <XCircle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-orange-700 font-medium">오늘은 쉬어가는 날</p>
                    <p className="text-sm text-orange-600">괜찮아요, 내일 다시 시작해봐요!</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-3">
                <Button 
                  onClick={handleComplete}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  size="lg"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  완료했어요!
                </Button>
                <Button 
                  onClick={handleSkip}
                  variant="outline"
                  className="flex-1 border-orange-300 text-orange-600 hover:bg-orange-50"
                  size="lg"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  오늘은 못했어요
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 주간 진행 현황 */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              이번 주 진행 현황
            </div>
            <Badge variant="secondary" className="text-indigo-600">
              성공률 {getSuccessRate()}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weeklyData.map((day, index) => (
              <div key={index} className="text-center">
                <p className="text-xs text-gray-500 mb-1">{day.day}</p>
                <div className="w-8 h-8 mx-auto flex items-center justify-center rounded-full bg-gray-50 border">
                  {getStatusIcon(day.status)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              완료: {weeklyData.filter(d => d.status === 'completed').length}일 • 
              건너뜀: {weeklyData.filter(d => d.status === 'skipped').length}일 • 
              남은 일: {7 - weeklyData.filter(d => d.status).length}일
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoutineTracker;
