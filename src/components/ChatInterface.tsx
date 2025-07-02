import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Heart, Lightbulb, MessageCircle } from 'lucide-react';

const ChatInterface = ({ goal }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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

  const getAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // 감정/상태 관련 응답
    if (message.includes('힘들') || message.includes('어려워') || message.includes('포기') || message.includes('못하겠')) {
      return [
        "힘드시죠? 완전히 이해해요. 목표를 달성하는 건 쉽지 않은 일이에요. 하지만 당신이 여기까지 온 것만으로도 대단해요! 💪",
        "잠깐, 숨을 고르고 생각해볼까요? 목표를 조금 더 작게 나누거나 시간을 줄여보는 건 어떨까요? 완벽하지 않아도 괜찮아요.",
        "오늘 하루만 해보시겠어요? 전체 목표 말고 딱 오늘 하루만요. 그것만으로도 충분히 의미있는 일이에요. ✨"
      ];
    }
    
    // 성공/완료 관련 응답
    if (message.includes('했어') || message.includes('완료') || message.includes('성공') || message.includes('좋')) {
      return [
        "와! 정말 멋져요! 🎉 이렇게 하나씩 쌓아가는 성공이 큰 변화를 만들어낼 거예요. 스스로를 자랑스러워하세요!",
        "대단해요! 오늘의 작은 승리가 내일의 큰 힘이 될 거예요. 이 기세로 계속 해봐요! 🔥",
        "완료! 꾸준함이 가장 큰 힘이에요. 당신의 노력이 정말 자랑스러워요. 내일도 함께 해봐요!"
      ];
    }
    
    // 조정/변경 관련 응답
    if (message.includes('바꾸고') || message.includes('조정') || message.includes('줄이') || message.includes('시간')) {
      return [
        "물론이죠! 목표를 조정하는 건 포기가 아니라 지혜로운 선택이에요. 무리하지 말고 지속 가능한 수준으로 맞춰봐요.",
        "좋은 생각이에요! 너무 무리한 목표보다는 꾸준히 할 수 있는 목표가 훨씬 효과적이에요. 어떻게 조정하고 싶으세요?",
        "스마트한 판단이에요! 목표 수정 탭으로 가서 시간이나 빈도를 조정해보세요. 작은 성공들이 모여 큰 변화를 만들어요. 💡"
      ];
    }
    
    // 동기부여 요청
    if (message.includes('동기') || message.includes('의욕') || message.includes('왜')) {
      return [
        "당신이 이 목표를 세운 이유를 기억해보세요. 그 처음 마음이 지금도 당신 안에 있어요. ✨",
        "작은 변화도 변화예요. 오늘 하루의 노력이 일주일 후, 한 달 후의 당신을 바꿀 거예요. 믿어보세요!",
        "완벽하지 않아도 괜찮아요. 중요한 건 포기하지 않고 계속 시도하는 것이에요. 당신은 이미 잘하고 있어요! 🌟"
      ];
    }
    
    // 기본 격려 응답
    const defaultResponses = [
      "언제나 응원하고 있어요! 궁금한 게 있으면 편하게 말씀해주세요. 😊",
      "하루하루 꾸준히 하는 당신이 정말 멋져요. 작은 걸음도 앞으로 나아가는 거예요! 👏",
      "목표 달성은 마라톤과 같아요. 천천히, 꾸준히가 중요해요. 함께 해봐요! 💪",
      "오늘도 좋은 하루 보내세요! 루틴에 대해 궁금한 게 있으면 언제든 물어보세요. 🌈"
    ];
    
    return defaultResponses;
  };

  const handleSendMessage = () => {
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

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const aiResponses = getAIResponse(inputMessage);
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: randomResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1500); // 1-2.5초 랜덤 딜레이
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickMessages = [
    "오늘 루틴 완료했어요!",
    "오늘은 너무 힘들어요",
    "목표를 조정하고 싶어요",
    "동기부여가 필요해요"
  ];

  return (
    <div className="max-w-4xl mx-auto">
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
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-indigo-200' : 'text-gray-500'
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
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
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
