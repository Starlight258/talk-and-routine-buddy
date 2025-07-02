
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageSquare, Sparkles, CheckCircle, XCircle } from 'lucide-react';

const ReflectionModal = ({ isOpen, onClose, routine, completionType, onComplete }) => {
  const [reflection, setReflection] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getAIFeedback = async (userReflection) => {
    const apiKey = localStorage.getItem('gemini_api_key');
    
    const prompt = `
사용자가 "${routine.title}" 루틴을 ${completionType === 'completed' ? '완료' : '건너뛰었'}습니다.
사용자의 소감: "${userReflection}"

다음 지침에 따라 응답해주세요:
1. 사용자의 감정과 상황에 공감
2. ${completionType === 'completed' ? '성공에 대한 격려와 칭찬' : '실패에 대한 위로와 격려'}
3. 루틴 조정이 필요한지 판단하고 구체적 제안
4. 다음 목표에 대한 동기부여
5. 200자 이내로 따뜻하고 실용적인 조언

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
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 300,
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
      return "소감을 잘 읽었어요. 꾸준히 하는 것이 가장 중요하니까 너무 부담갖지 마세요! 💪";
    }
  };

  const handleSubmit = async () => {
    if (!reflection.trim()) return;
    
    setIsLoading(true);
    const feedback = await getAIFeedback(reflection);
    setAiResponse(feedback);
    setIsLoading(false);
  };

  const handleComplete = () => {
    onComplete(reflection, aiResponse);
    setReflection('');
    setAiResponse('');
  };

  const placeholderTexts = {
    completed: "오늘 루틴을 완료한 기분이 어떠신가요? 어려웠던 점이나 좋았던 점을 자유롭게 적어주세요.",
    skipped: "오늘 루틴을 하지 못한 이유나 기분을 솔직하게 적어주세요. 괜찮아요, 모든 걸 털어놓으세요."
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
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
              placeholder={placeholderTexts[completionType]}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {!aiResponse && (
            <Button 
              onClick={handleSubmit}
              disabled={!reflection.trim() || isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  AI가 생각 중...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI 코치에게 피드백 받기
                </>
              )}
            </Button>
          )}

          {aiResponse && (
            <Card className="border-l-4 border-l-indigo-500 bg-indigo-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  AI 코치의 피드백
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
                다음에 적용하기
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

export default ReflectionModal;
