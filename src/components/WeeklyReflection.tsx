
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageCircle, TrendingUp, Heart, Star, Lightbulb } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const WeeklyReflection = ({ goal }) => {
  const [weeklyStats, setWeeklyStats] = useState({
    completedDays: 0,
    totalDays: 0,
    successRate: 0,
    streak: 0
  });
  const [reflection, setReflection] = useState('');
  const [mood, setMood] = useState('');
  const [challenges, setChallenges] = useState('');
  const [hasReflectedThisWeek, setHasReflectedThisWeek] = useState(false);
  const [aiInsight, setAiInsight] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    calculateWeeklyStats();
    checkWeeklyReflection();
  }, [goal]);

  const calculateWeeklyStats = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // 이번 주 일요일

    let completedDays = 0;
    let totalDays = 0;

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      if (date <= today) { // 오늘까지만
        const dateStr = date.toDateString();
        const status = localStorage.getItem(`routine_${dateStr}`);
        
        if (status) {
          totalDays++;
          if (status === 'completed') completedDays++;
        }
      }
    }

    const successRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

    setWeeklyStats({
      completedDays,
      totalDays,
      successRate,
      streak: completedDays
    });
  };

  const checkWeeklyReflection = () => {
    const today = new Date();
    const weekKey = `reflection_${today.getFullYear()}_${getWeekNumber(today)}`;
    const savedReflection = localStorage.getItem(weekKey);
    
    if (savedReflection) {
      const data = JSON.parse(savedReflection);
      setReflection(data.reflection || '');
      setMood(data.mood || '');
      setChallenges(data.challenges || '');
      setAiInsight(data.aiInsight || '');
      setHasReflectedThisWeek(true);
    }
  };

  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  const generateAIInsight = (stats, userReflection, userMood, userChallenges) => {
    let insight = "";
    
    if (stats.successRate >= 80) {
      insight = "🎉 이번 주 정말 훌륭했어요! " + stats.successRate + "%의 성공률을 달성하셨네요. ";
      insight += "이 기세를 유지하면서도 너무 무리하지 마세요. ";
    } else if (stats.successRate >= 60) {
      insight = "✨ 이번 주도 잘 하셨어요! " + stats.successRate + "%는 충분히 의미있는 성과예요. ";
      insight += "완벽하지 않아도 괜찮아요. 꾸준함이 더 중요해요. ";
    } else if (stats.successRate >= 40) {
      insight = "💪 힘든 한 주였지만 포기하지 않으셨네요. ";
      insight += "다음 주는 목표를 조금 낮춰서 부담을 줄여보는 건 어떨까요? ";
    } else {
      insight = "🌱 힘든 시기를 보내고 계시는군요. 괜찮아요, 새로운 시작이 될 수 있어요. ";
      insight += "목표를 더 작게 나누어 작은 성공부터 쌓아가봐요. ";
    }

    if (userMood === 'stressed' || userChallenges.includes('스트레스') || userChallenges.includes('힘들')) {
      insight += "\n\n스트레스가 많으셨던 것 같아요. 루틴을 스트레스 해소의 도구로 활용해보세요. ";
      insight += "완벽하게 하려고 하지 말고, 그날그날 컨디션에 맞춰 유연하게 조정하는 것도 좋습니다.";
    }

    if (userMood === 'motivated' || userReflection.includes('좋았') || userReflection.includes('성취')) {
      insight += "\n\n긍정적인 에너지가 느껴져요! 이런 동기가 지속될 수 있도록 작은 보상을 주는 것도 좋겠어요. ";
      insight += "자신을 칭찬하는 시간을 가져보세요.";
    }

    return insight;
  };

  const handleSubmitReflection = () => {
    const today = new Date();
    const weekKey = `reflection_${today.getFullYear()}_${getWeekNumber(today)}`;
    
    const aiInsightGenerated = generateAIInsight(weeklyStats, reflection, mood, challenges);
    
    const reflectionData = {
      reflection,
      mood,
      challenges,
      aiInsight: aiInsightGenerated,
      weeklyStats,
      date: today.toISOString()
    };

    localStorage.setItem(weekKey, JSON.stringify(reflectionData));
    setAiInsight(aiInsightGenerated);
    setHasReflectedThisWeek(true);

    toast({
      title: "회고 완료! 🎉",
      description: "AI 인사이트가 생성되었어요. 다음 주도 함께 해봐요!",
    });
  };

  const moodOptions = [
    { value: 'great', label: '😊 좋았어요', color: 'bg-green-100 text-green-800' },
    { value: 'good', label: '🙂 괜찮았어요', color: 'bg-blue-100 text-blue-800' },
    { value: 'neutral', label: '😐 그저 그랬어요', color: 'bg-gray-100 text-gray-800' },
    { value: 'tired', label: '😴 피곤했어요', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'stressed', label: '😰 힘들었어요', color: 'bg-red-100 text-red-800' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 주간 통계 */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            이번 주 성과
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{weeklyStats.completedDays}</p>
              <p className="text-sm text-gray-600">완료한 날</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{weeklyStats.totalDays}</p>
              <p className="text-sm text-gray-600">시도한 날</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">{weeklyStats.successRate}%</p>
              <p className="text-sm text-gray-600">성공률</p>
            </div>
            <div className="text-center">
              <Badge 
                variant="secondary" 
                className={`${weeklyStats.successRate >= 70 ? 'bg-green-100 text-green-800' : 
                             weeklyStats.successRate >= 50 ? 'bg-blue-100 text-blue-800' : 
                             'bg-orange-100 text-orange-800'}`}
              >
                {weeklyStats.successRate >= 70 ? '훌륭해요!' : 
                 weeklyStats.successRate >= 50 ? '잘했어요!' : '괜찮아요!'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI 인사이트 (이미 회고를 작성한 경우) */}
      {hasReflectedThisWeek && aiInsight && (
        <Card className="border-l-4 border-l-indigo-500 bg-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-700">
              <Lightbulb className="w-5 h-5" />
              AI 코치의 인사이트
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-indigo-800 whitespace-pre-wrap">{aiInsight}</p>
          </CardContent>
        </Card>
      )}

      {/* 회고 작성 폼 */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-indigo-600" />
            주간 회고 {hasReflectedThisWeek && <Badge variant="secondary">완료</Badge>}
          </CardTitle>
          <p className="text-gray-600">
            이번 주는 어떠셨나요? 솔직한 생각을 들려주세요.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 기분 선택 */}
          <div>
            <label className="block text-sm font-medium mb-3">이번 주 전반적인 기분은 어떠셨나요?</label>
            <div className="flex flex-wrap gap-2">
              {moodOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={mood === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMood(option.value)}
                  className={mood === option.value ? option.color : ''}
                  disabled={hasReflectedThisWeek}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* 회고 내용 */}
          <div>
            <label className="block text-sm font-medium mb-2">이번 주를 돌아보며</label>
            <Textarea
              placeholder="이번 주 루틴을 진행하면서 느꼈던 점, 좋았던 점, 아쉬웠던 점 등을 자유롭게 적어주세요..."
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={4}
              disabled={hasReflectedThisWeek}
            />
          </div>

          {/* 어려움/도전 */}
          <div>
            <label className="block text-sm font-medium mb-2">어떤 어려움이나 도전이 있었나요?</label>
            <Textarea
              placeholder="루틴을 방해했던 요소나 힘들었던 점이 있다면 알려주세요. AI가 다음 주 계획에 반영해드릴게요."
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              rows={3}
              disabled={hasReflectedThisWeek}
            />
          </div>

          {!hasReflectedThisWeek && (
            <Button 
              onClick={handleSubmitReflection}
              disabled={!reflection || !mood}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              size="lg"
            >
              <Star className="w-4 h-4 mr-2" />
              회고 완료하고 AI 인사이트 받기
            </Button>
          )}

          {hasReflectedThisWeek && (
            <div className="text-center text-gray-600">
              <Heart className="w-5 h-5 mx-auto mb-2 text-pink-500" />
              <p>이번 주 회고를 완료했어요! 다음 주도 함께 해봐요.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 지난 회고 (선택사항) */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            성장 히스토리
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-8">
            매주 회고를 작성하면 성장 과정을 한눈에 볼 수 있어요!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyReflection;
