
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Sparkles, CheckCircle, XCircle, Tag } from 'lucide-react';
import { failureReasons, analyzeFailureText } from '@/utils/failureAnalysis';

const EnhancedReflectionModal = ({ isOpen, onClose, routine, completionType, onComplete }) => {
  const [reflection, setReflection] = useState('');
  const [selectedFailureReasons, setSelectedFailureReasons] = useState<string[]>([]);
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getContextualAIFeedback = async (userReflection, failureReasons = []) => {
    const apiKey = localStorage.getItem('gemini_api_key');
    
    // Get user's historical data for context
    const userHistory = getUserContext(routine.id);
    
    const prompt = `
사용자 맥락 정보:
- 루틴: "${routine.title}"
- 최근 7일 성공률: ${userHistory.recentSuccessRate}%
- 주요 실패 이유: ${userHistory.commonFailures.join(', ')}
- 현재 연속 성공: ${userHistory.currentStreak}일

오늘 상황:
- 완료 상태: ${completionType === 'completed' ? '완료' : '건너뜀'}
- 사용자 소감: "${userReflection}"
${failureReasons.length > 0 ? `- 실패 이유: ${failureReasons.join(', ')}` : ''}

개인화된 코칭 지침:
1. 사용자의 과거 패턴을 참고하여 맞춤형 조언
2. ${completionType === 'completed' ? '성공 패턴 강화 방안' : '실패 패턴 개선 방안'}
3. 구체적이고 실행 가능한 제안
4. 감정적 지지와 격려
5. 150자 내외로 따뜻하고 개인적인 톤

응답:`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 250,
          }
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('응답을 받을 수 없습니다.');
      }
    } catch (error) {
      console.error('AI 피드백 오류:', error);
      return getDefaultContextualFeedback(completionType, userHistory);
    }
  };

  const getUserContext = (routineId) => {
    const today = new Date();
    let recentSuccessCount = 0;
    let recentTotal = 0;
    let currentStreak = 0;
    const failureReasons = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const status = localStorage.getItem(`routine_${routineId}_${dateStr}`);
      const reflection = localStorage.getItem(`routine_${routineId}_reflection_${dateStr}`);
      
      if (status) {
        recentTotal++;
        if (status === 'completed') {
          recentSuccessCount++;
          if (i === 0) currentStreak = 1;
        } else if (reflection) {
          const data = JSON.parse(reflection);
          if (data.failureReasons) {
            failureReasons.push(...data.failureReasons);
          }
        }
      }
    }

    return {
      recentSuccessRate: recentTotal > 0 ? Math.round((recentSuccessCount / recentTotal) * 100) : 0,
      commonFailures: [...new Set(failureReasons)],
      currentStreak
    };
  };

  const getDefaultContextualFeedback = (type, history) => {
    if (type === 'completed') {
      return `축하해요! 연속 ${history.currentStreak}일째 성공이네요. 이 패턴을 유지해보세요! 💪`;
    } else {
      return `괜찮아요. 최근 성공률이 ${history.recentSuccessRate}%니까 충분히 잘하고 있어요. 내일 다시 시작해봐요! 🌟`;
    }
  };

  const handleReflectionChange = (text) => {
    setReflection(text);
    if (completionType === 'skipped') {
      const autoDetectedReasons = analyzeFailureText(text);
      setSelectedFailureReasons(autoDetectedReasons);
    }
  };

  const toggleFailureReason = (reasonId) => {
    setSelectedFailureReasons(prev => 
      prev.includes(reasonId) 
        ? prev.filter(id => id !== reasonId)
        : [...prev, reasonId]
    );
  };

  const handleSubmit = async () => {
    if (!reflection.trim()) return;
    
    setIsLoading(true);
    const feedback = await getContextualAIFeedback(
      reflection, 
      completionType === 'skipped' ? selectedFailureReasons : []
    );
    setAiResponse(feedback);
    setIsLoading(false);
  };

  const handleComplete = () => {
    const reflectionData = {
      reflection,
      aiResponse,
      failureReasons: completionType === 'skipped' ? selectedFailureReasons : [],
      completionType,
      timestamp: new Date().toISOString()
    };
    
    onComplete(reflectionData);
    setReflection('');
    setSelectedFailureReasons([]);
    setAiResponse('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {completionType === 'completed' ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-orange-500" />
            )}
            {routine.title} - 오늘의 소감
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              오늘 어떠셨나요? 솔직한 마음을 들려주세요 💭
            </label>
            <Textarea
              placeholder={completionType === 'completed' 
                ? "오늘 루틴을 완료한 기분이 어떠신가요? 어려웠던 점이나 좋았던 점을 자유롭게 적어주세요."
                : "오늘 루틴을 하지 못한 이유나 기분을 솔직하게 적어주세요. 괜찮아요, 모든 걸 털어놓으세요."}
              value={reflection}
              onChange={(e) => handleReflectionChange(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {completionType === 'skipped' && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                <Tag className="w-4 h-4" />
                어떤 이유 때문이었나요? (여러 개 선택 가능)
              </label>
              <div className="flex flex-wrap gap-2">
                {failureReasons.map((reason) => (
                  <Badge
                    key={reason.id}
                    variant={selectedFailureReasons.includes(reason.id) ? "default" : "outline"}
                    className="cursor-pointer transition-colors"
                    onClick={() => toggleFailureReason(reason.id)}
                  >
                    {reason.text}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {!aiResponse && (
            <Button 
              onClick={handleSubmit}
              disabled={!reflection.trim() || isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  AI가 맞춤 코칭 중...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  맞춤형 AI 코칭 받기
                </>
              )}
            </Button>
          )}

          {aiResponse && (
            <Card className="border-l-4 border-l-indigo-500 bg-indigo-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  개인 맞춤 AI 코칭
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-indigo-800 whitespace-pre-wrap">{aiResponse}</p>
              </CardContent>
            </Card>
          )}

          {aiResponse && (
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                나중에 적용하기
              </Button>
              <Button 
                onClick={handleComplete}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                완료하기
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedReflectionModal;
