import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageCircle, TrendingUp, Heart, Star, Lightbulb, Target } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getFailureStats } from '@/utils/failureAnalysis';

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
  const [suggestedAdjustments, setSuggestedAdjustments] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    calculateWeeklyStats();
    checkWeeklyReflection();
  }, [goal]);

  const calculateWeeklyStats = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    let completedDays = 0;
    let totalDays = 0;

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      if (date <= today) {
        const dateStr = date.toDateString();
        const status = localStorage.getItem(`routine_${goal?.id}_${dateStr}`);
        
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
      setSuggestedAdjustments(data.suggestedAdjustments || []);
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

  const generateRoutineAdjustments = (stats, failureStats, userInput) => {
    const adjustments = [];
    
    if (stats.successRate < 50) {
      adjustments.push({
        type: 'duration',
        current: goal.duration,
        suggested: Math.max(10, Math.floor(goal.duration * 0.7)),
        reason: '성공률이 낮아 시간을 단축하는 것을 제안합니다'
      });
    }
    
    if (failureStats.byCategory.time >= 2) {
      adjustments.push({
        type: 'time',
        current: goal.time,
        suggested: '더 여유로운 시간대',
        reason: '시간 부족이 주된 방해 요소로 보입니다'
      });
    }
    
    if (failureStats.byCategory.motivation >= 2) {
      adjustments.push({
        type: 'difficulty',
        current: goal.difficulty,
        suggested: 'easy',
        reason: '동기 부족 문제로 난이도를 낮추는 것을 제안합니다'
      });
    }
    
    if (stats.successRate >= 80 && stats.totalDays >= 5) {
      adjustments.push({
        type: 'expansion',
        current: goal.duration,
        suggested: goal.duration + 10,
        reason: '훌륭한 성과입니다! 시간을 늘려볼까요?'
      });
    }
    
    return adjustments;
  };

  const generateAdvancedAIInsight = (stats, userReflection, userMood, userChallenges, failureStats) => {
    let insight = "";
    
    // 성공률 기반 기본 피드백
    if (stats.successRate >= 80) {
      insight = `🎉 이번 주 정말 훌륭했어요! ${stats.successRate}%의 성공률을 달성하셨네요. `;
    } else if (stats.successRate >= 60) {
      insight = `✨ 이번 주도 잘 하셨어요! ${stats.successRate}%는 충분히 의미있는 성과예요. `;
    } else if (stats.successRate >= 40) {
      insight = `💪 힘든 한 주였지만 포기하지 않으셨네요. `;
    } else {
      insight = `🌱 힘든 시기를 보내고 계시는군요. 괜찮아요, 새로운 시작이 될 수 있어요. `;
    }
    
    // 실패 패턴 분석 기반 조언
    if (failureStats.byCategory.time >= 2) {
      insight += "\n\n⏰ 시간 부족이 주된 방해 요소로 보입니다. 루틴 시간을 줄이거나 더 여유로운 시간대로 옮겨보는 건 어떨까요?";
    }
    
    if (failureStats.byCategory.motivation >= 2) {
      insight += "\n\n💭 동기 부족이 반복되고 있어요. 목표를 작게 나누거나 보상 시스템을 도입해보세요.";
    }
    
    if (failureStats.byCategory.health >= 2) {
      insight += "\n\n🏥 컨디션 난조가 자주 발생하네요. 충분한 휴식과 함께 루틴 강도를 조절해보세요.";
    }
    
    // 기분 기반 맞춤 조언
    if (userMood === 'stressed' || userChallenges.includes('스트레스')) {
      insight += "\n\n스트레스 관리가 루틴 성공의 열쇠가 될 것 같아요. 루틴 자체가 스트레스 해소 도구가 되도록 접근해보세요.";
    }
    
    return insight;
  };

  const handleSubmitReflection = () => {
    const today = new Date();
    const weekKey = `reflection_${today.getFullYear()}_${getWeekNumber(today)}`;
    
    // 실패 통계 수집
    const failureStats = getFailureStats(goal.id, 7);
    
    // AI 인사이트 생성
    const aiInsightGenerated = generateAdvancedAIInsight(weeklyStats, reflection, mood, challenges, failureStats);
    
    // 루틴 조정 제안 생성
    const adjustments = generateRoutineAdjustments(weeklyStats, failureStats, { reflection, mood, challenges });
    
    const reflectionData = {
      reflection,
      mood,
      challenges,
      aiInsight: aiInsightGenerated,
      suggestedAdjustments: adjustments,
      weeklyStats,
      failureStats,
      date: today.toISOString()
    };

    localStorage.setItem(weekKey, JSON.stringify(reflectionData));
    setAiInsight(aiInsightGenerated);
    setSuggestedAdjustments(adjustments);
    setHasReflectedThisWeek(true);

    toast({
      title: "회고 완료! 🎉",
      description: `AI 인사이트와 ${adjustments.length}개의 루틴 조정 제안이 생성되었어요!`,
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

      {/* AI 인사이트와 루틴 조정 제안 */}
      {hasReflectedThisWeek && aiInsight && (
        <>
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

          {suggestedAdjustments.length > 0 && (
            <Card className="border-l-4 border-l-orange-500 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <Target className="w-5 h-5" />
                  루틴 조정 제안
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {suggestedAdjustments.map((adjustment, index) => (
                    <div key={index} className="p-3 bg-white border border-orange-200 rounded-lg">
                      <p className="font-medium text-orange-800 mb-1">
                        {adjustment.type === 'duration' && '⏱️ 소요 시간 조정'}
                        {adjustment.type === 'time' && '🕐 시간대 조정'}
                        {adjustment.type === 'difficulty' && '📊 난이도 조정'}
                        {adjustment.type === 'expansion' && '📈 루틴 확장'}
                      </p>
                      <p className="text-sm text-orange-700 mb-2">{adjustment.reason}</p>
                      <div className="text-xs text-orange-600">
                        현재: {adjustment.current} → 제안: {adjustment.suggested}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
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
              회고 완료하고 맞춤 조정 제안 받기
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

      {/* 성장 히스토리 */}
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
