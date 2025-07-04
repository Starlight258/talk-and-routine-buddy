
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Heart, Lightbulb, MessageCircle, AlertTriangle } from 'lucide-react';

const ChatInterface = ({ goal }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKeyValid, setApiKeyValid] = useState(true);
  const [showApiKeyReset, setShowApiKeyReset] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // 초기 인사 메시지
    const welcomeMessage = {
      id: Date.now(),
      type: 'ai',
      content: `안녕하세요! 저는 당신의 루틴 코치 AI예요. "${goal?.title}" 목표를 함께 달성해나가요! 🎯\n\n궁금한 것이 있거나 힘든 일이 있으면 언제든 말씀해주세요. 어떻게 도와드릴까요?`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [goal]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getGeminiResponse = async (userMessage) => {
    const apiKey = localStorage.getItem('gemini_api_key');
    
    if (!apiKey) {
      throw new Error('API 키가 설정되지 않았습니다.');
    }
    
    const prompt = `
당신은 친근하고 격려적인 루틴 코치 AI입니다. 사용자의 목표는 "${goal?.title}"입니다.

사용자 메시지: "${userMessage}"

다음 지침에 따라 응답해주세요:
1. 친근하고 따뜻한 톤으로 대화
2. 실패나 어려움에 대해서는 위로와 격려 제공
3. 성공에 대해서는 칭찬과 동기부여
4. 목표 조정이 필요하면 구체적인 제안
5. 150자 이내로 간결하게 응답
6. 이모지를 적절히 사용

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
            maxOutputTokens: 200,
          }
        })
      });

      const data = await response.json();
      console.log('Gemini API 응답:', data);
      
      if (!response.ok) {
        // API 키 만료나 유효하지 않은 경우만 처리
        if (data.error?.code === 400 && 
            (data.error?.message?.includes('API key expired') || 
             data.error?.message?.includes('API key not valid') ||
             data.error?.details?.some(detail => detail.reason === 'API_KEY_INVALID'))) {
          // 연속으로 3번 이상 API 키 오류가 발생한 경우에만 키 재설정 요구
          if (retryCount >= 2) {
            setApiKeyValid(false);
            setShowApiKeyReset(true);
            throw new Error('API 키에 문제가 있습니다. 새로운 키로 교체해주세요.');
          } else {
            setRetryCount(prev => prev + 1);
            throw new Error('API 요청에 실패했습니다. 다시 시도해주세요.');
          }
        } else {
          // 다른 오류는 일시적인 문제로 처리
          throw new Error(`API 오류: ${data.error?.message || '일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'}`);
        }
      }
      
      // 성공적인 응답 시 재시도 카운트 리셋
      setRetryCount(0);
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('응답을 받을 수 없습니다.');
      }
    } catch (error) {
      console.error('Gemini API 오류:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // AI 응답 받기
    try {
      const aiResponse = await getGeminiResponse(inputMessage);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: error.message,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleApiKeyReset = () => {
    localStorage.removeItem('gemini_api_key');
    window.location.reload();
  };

  const quickMessages = [
    "오늘 루틴 완료했어요!",
    "오늘은 너무 힘들어요",
    "목표를 조정하고 싶어요",
    "동기부여가 필요해요"
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {showApiKeyReset && (
        <Card className="border-red-200 bg-red-50 mb-4">
          <CardContent className="p-4">
            <div className="flex items-start gap-3 text-red-700">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-lg mb-2">🔑 API 키 문제 발생</p>
                <p className="text-sm mb-3">
                  Google Gemini API 키가 만료되었거나 유효하지 않습니다.<br/>
                  새로운 API 키로 교체해주세요.
                </p>
                <div className="bg-red-100 p-3 rounded-lg mb-3">
                  <p className="text-xs font-medium mb-1">📝 새 API 키 받는 방법:</p>
                  <p className="text-xs">
                    1. <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-medium">Google AI Studio</a> 접속<br/>
                    2. 로그인 후 "Create API Key" 클릭<br/>
                    3. 생성된 새 키를 복사해서 사용
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleApiKeyReset}
                className="bg-red-600 hover:bg-red-700 text-white border-0"
                size="sm"
              >
                새 키 설정하기
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card className="border-0 shadow-lg h-[600px] flex flex-col">
        <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-indigo-600" />
            AI 루틴 코치와 대화하기
          </CardTitle>
          <p className="text-sm text-gray-600">
            목표: {goal?.title} • 언제든 편하게 이야기해주세요
          </p>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'ai' && (
                  <Avatar className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500">
                    <AvatarFallback>
                      <Bot className="w-4 h-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-indigo-600 text-white'
                      : message.isError 
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-indigo-200' : 
                    message.isError ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('ko-KR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
                
                {message.type === 'user' && (
                  <Avatar className="w-8 h-8 bg-gray-300">
                    <AvatarFallback>
                      <User className="w-4 h-4 text-gray-600" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <Avatar className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500">
                  <AvatarFallback>
                    <Bot className="w-4 h-4 text-white" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* 빠른 응답 버튼 */}
          <div className="px-4 py-2 border-t bg-gray-50">
            <div className="flex gap-2 flex-wrap">
              {quickMessages.map((msg, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInputMessage(msg);
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                  className="text-xs"
                  disabled={!apiKeyValid}
                >
                  {msg}
                </Button>
              ))}
            </div>
          </div>
          
          {/* 입력 영역 */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="AI 코치에게 무엇이든 말해보세요..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                disabled={!apiKeyValid}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping || !apiKeyValid}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;
