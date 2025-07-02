
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Target, BarChart3, Calendar, Heart, Users } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import Dashboard from '@/components/Dashboard';
import WeeklyReflection from '@/components/WeeklyReflection';
import ApiKeySetup from '@/components/ApiKeySetup';
import MultiRoutineManager from '@/components/MultiRoutineManager';

const Index = () => {
  const [hasApiKey, setHasApiKey] = useState(false);
  const [routines, setRoutines] = useState([]);
  const [activeTab, setActiveTab] = useState('calendar'); // 초기 탭을 달력으로 변경

  useEffect(() => {
    // API 키 확인
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setHasApiKey(true);
    }

    // 저장된 루틴들 로드
    const savedRoutines = localStorage.getItem('userRoutines');
    if (savedRoutines) {
      setRoutines(JSON.parse(savedRoutines));
    }
  }, []);

  const handleApiKeySet = (apiKey) => {
    setHasApiKey(true);
  };

  // API 키가 없으면 API 키 설정 화면 표시
  if (!hasApiKey) {
    return <ApiKeySetup onApiKeySet={handleApiKeySet} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-pink-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              루틴과 말하기
            </h1>
          </div>
          <p className="text-sm text-gray-600">
            AI와 함께 유연하게 목표를 조정하며, 지속 가능한 루틴을 만들어가세요
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              달력
            </TabsTrigger>
            <TabsTrigger value="routines" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              루틴들
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              AI 코치
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              현황
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <MultiRoutineManager initialView="calendar" />
          </TabsContent>

          <TabsContent value="routines">
            <MultiRoutineManager initialView="routines" />
          </TabsContent>

          <TabsContent value="chat">
            <ChatInterface goal={routines[0]} />
          </TabsContent>

          <TabsContent value="dashboard">
            <Dashboard goal={routines[0]} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
