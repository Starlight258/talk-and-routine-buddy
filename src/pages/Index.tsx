
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Target, BarChart3, Calendar, Heart } from 'lucide-react';
import GoalSetup from '@/components/GoalSetup';
import ChatInterface from '@/components/ChatInterface';
import RoutineTracker from '@/components/RoutineTracker';
import Dashboard from '@/components/Dashboard';
import WeeklyReflection from '@/components/WeeklyReflection';
import ApiKeySetup from '@/components/ApiKeySetup';

const Index = () => {
  const [hasApiKey, setHasApiKey] = useState(false);
  const [hasGoal, setHasGoal] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [activeTab, setActiveTab] = useState('goal');

  useEffect(() => {
    // API 키 확인
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setHasApiKey(true);
    }

    // 저장된 목표가 있는지 확인
    const savedGoal = localStorage.getItem('userGoal');
    if (savedGoal) {
      setCurrentGoal(JSON.parse(savedGoal));
      setHasGoal(true);
      setActiveTab('routine');
    }
  }, []);

  const handleApiKeySet = (apiKey) => {
    setHasApiKey(true);
  };

  const handleGoalSet = (goal) => {
    setCurrentGoal(goal);
    setHasGoal(true);
    localStorage.setItem('userGoal', JSON.stringify(goal));
    setActiveTab('routine');
  };

  // API 키가 없으면 API 키 설정 화면 표시
  if (!hasApiKey) {
    return <ApiKeySetup onApiKeySet={handleApiKeySet} />;
  }

  // 목표가 없으면 목표 설정 화면 표시
  if (!hasGoal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Heart className="w-8 h-8 text-pink-500" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                루틴과 말하기
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              AI와 함께 유연하게 목표를 조정하며, 지속 가능한 루틴을 만들어가세요. 
              너무 빡센 계획으로 포기하지 마세요!
            </p>
          </div>
          <GoalSetup onGoalSet={handleGoalSet} />
        </div>
      </div>
    );
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
            현재 목표: {currentGoal?.title}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="routine" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              루틴
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              AI 코치
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              현황
            </TabsTrigger>
            <TabsTrigger value="reflection" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              회고
            </TabsTrigger>
            <TabsTrigger value="goal" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              목표수정
            </TabsTrigger>
          </TabsList>

          <TabsContent value="routine">
            <RoutineTracker goal={currentGoal} />
          </TabsContent>

          <TabsContent value="chat">
            <ChatInterface goal={currentGoal} />
          </TabsContent>

          <TabsContent value="dashboard">
            <Dashboard goal={currentGoal} />
          </TabsContent>

          <TabsContent value="reflection">
            <WeeklyReflection goal={currentGoal} />
          </TabsContent>

          <TabsContent value="goal">
            <GoalSetup 
              onGoalSet={handleGoalSet} 
              existingGoal={currentGoal}
              isEditing={true}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
