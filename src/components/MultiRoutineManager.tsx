
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Target, Calendar } from 'lucide-react';
import RoutineCard from './RoutineCard';
import CalendarView from './CalendarView';
import GoalSetup from './GoalSetup';

const MultiRoutineManager = () => {
  const [routines, setRoutines] = useState([]);
  const [showAddRoutine, setShowAddRoutine] = useState(false);
  const [activeView, setActiveView] = useState('routines');

  useEffect(() => {
    loadRoutines();
  }, []);

  const loadRoutines = () => {
    const savedRoutines = localStorage.getItem('userRoutines');
    if (savedRoutines) {
      setRoutines(JSON.parse(savedRoutines));
    }
  };

  const saveRoutines = (newRoutines) => {
    setRoutines(newRoutines);
    localStorage.setItem('userRoutines', JSON.stringify(newRoutines));
  };

  const handleAddRoutine = (routineData) => {
    const newRoutine = {
      ...routineData,
      id: Date.now(),
      color: getRandomColor(),
      createdAt: new Date().toISOString(),
      streak: 0,
      totalDays: 0,
      successRate: 0
    };
    
    const updatedRoutines = [...routines, newRoutine];
    saveRoutines(updatedRoutines);
    setShowAddRoutine(false);
  };

  const getRandomColor = () => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-red-500', 'bg-orange-500', 'bg-teal-500'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const updateRoutine = (updatedRoutine) => {
    const updatedRoutines = routines.map(routine => 
      routine.id === updatedRoutine.id ? updatedRoutine : routine
    );
    saveRoutines(updatedRoutines);
  };

  const deleteRoutine = (routineId) => {
    const updatedRoutines = routines.filter(routine => routine.id !== routineId);
    saveRoutines(updatedRoutines);
  };

  if (showAddRoutine) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="outline" 
            onClick={() => setShowAddRoutine(false)}
            className="mb-4"
          >
            ← 돌아가기
          </Button>
          <GoalSetup onGoalSet={handleAddRoutine} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            내 루틴들
          </h2>
          <p className="text-gray-600">
            {routines.length}개의 루틴이 있어요
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeView === 'routines' ? 'default' : 'outline'}
            onClick={() => setActiveView('routines')}
            size="sm"
          >
            <Target className="w-4 h-4 mr-2" />
            루틴
          </Button>
          <Button
            variant={activeView === 'calendar' ? 'default' : 'outline'}
            onClick={() => setActiveView('calendar')}
            size="sm"
          >
            <Calendar className="w-4 h-4 mr-2" />
            달력
          </Button>
        </div>
      </div>

      {activeView === 'routines' && (
        <>
          {/* 루틴 목록 */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {routines.map((routine) => (
              <RoutineCard
                key={routine.id}
                routine={routine}
                onUpdate={updateRoutine}
                onDelete={deleteRoutine}
              />
            ))}
            
            {/* 새 루틴 추가 카드 */}
            <Card 
              className="border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors cursor-pointer bg-gradient-to-br from-gray-50 to-white"
              onClick={() => setShowAddRoutine(true)}
            >
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <Plus className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="font-medium text-gray-600 mb-2">새 루틴 추가</h3>
                <p className="text-sm text-gray-500">새로운 목표를 설정해보세요</p>
              </CardContent>
            </Card>
          </div>

          {routines.length === 0 && (
            <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardContent className="p-8 text-center">
                <Target className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  첫 번째 루틴을 만들어주세요!
                </h3>
                <p className="text-gray-600 mb-4">
                  작은 목표부터 시작해서 꾸준한 습관을 만들어보세요
                </p>
                <Button 
                  onClick={() => setShowAddRoutine(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  루틴 추가하기
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {activeView === 'calendar' && (
        <CalendarView routines={routines} />
      )}
    </div>
  );
};

export default MultiRoutineManager;
