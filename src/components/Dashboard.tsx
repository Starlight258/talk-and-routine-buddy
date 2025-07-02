import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Calendar, Target, Flame, Award, Clock, CheckCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = ({ goal }) => {
  const [stats, setStats] = useState({
    totalDays: 0,
    completedDays: 0,
    currentStreak: 0,
    longestStreak: 0,
    successRate: 0,
    thisWeekSuccess: 0
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    calculateStats();
    loadChartData();
  }, [goal]);

  const calculateStats = () => {
    const today = new Date();
    let totalDays = 0;
    let completedDays = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let thisWeekSuccess = 0;

    // 지난 30일 데이터 분석
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const status = localStorage.getItem(`routine_${dateStr}`);
      
      if (status) {
        totalDays++;
        if (status === 'completed') {
          completedDays++;
          tempStreak++;
          if (i <= 7) thisWeekSuccess++; // 지난 7일
        } else {
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }
          tempStreak = 0;
        }
      }
      
      // 현재 연속 기록 계산 (오늘부터 거꾸로)
      if (i === 0) {
        if (status === 'completed') {
          currentStreak = 1;
          for (let j = 1; j < 30; j++) {
            const prevDate = new Date(today);
            prevDate.setDate(prevDate.getDate() - j);
            const prevStatus = localStorage.getItem(`routine_${prevDate.toDateString()}`);
            if (prevStatus === 'completed') {
              currentStreak++;
            } else {
              break;
            }
          }
        }
      }
    }

    const successRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

    setStats({
      totalDays,
      completedDays,
      currentStreak,
      longestStreak: Math.max(longestStreak, tempStreak),
      successRate,
      thisWeekSuccess
    });
  };

  const loadChartData = () => {
    const today = new Date();
    
    // 주간 데이터 (지난 4주)
    const weekly = [];
    for (let week = 3; week >= 0; week--) {
      let weekSuccess = 0;
      let weekTotal = 0;
      
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (week * 7 + day));
        const status = localStorage.getItem(`routine_${date.toDateString()}`);
        
        if (status) {
          weekTotal++;
          if (status === 'completed') weekSuccess++;
        }
      }
      
      weekly.push({
        week: `${week + 1}주 전`,
        successRate: weekTotal > 0 ? Math.round((weekSuccess / weekTotal) * 100) : 0,
        completed: weekSuccess,
        total: weekTotal
      });
    }
    setWeeklyData(weekly.reverse());

    // 월간 데이터 (지난 7일)
    const daily = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const status = localStorage.getItem(`routine_${date.toDateString()}`);
      
      daily.push({
        day: date.toLocaleDateString('ko-KR', { weekday: 'short' }),
        completed: status === 'completed' ? 1 : 0,
        date: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
      });
    }
    setMonthlyData(daily);
  };

  const getMotivationMessage = () => {
    if (stats.successRate >= 80) {
      return { message: "🔥 완벽해요! 이 기세로 계속 가봐요!", color: "text-green-600" };
    } else if (stats.successRate >= 60) {
      return { message: "✨ 잘하고 있어요! 조금만 더 힘내봐요!", color: "text-blue-600" };
    } else if (stats.successRate >= 40) {
      return { message: "💪 괜찮아요, 꾸준히 하는 게 중요해요!", color: "text-orange-600" };
    } else {
      return { message: "🌱 새로운 시작이에요. 하루씩 쌓아가봐요!", color: "text-indigo-600" };
    }
  };

  const motivation = getMotivationMessage();

  return (
    <div className="space-y-6">
      {/* 성취 메시지 */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardContent className="p-6 text-center">
          <h3 className={`text-lg font-semibold ${motivation.color} mb-2`}>
            {motivation.message}
          </h3>
          <p className="text-gray-600">
            지금까지 {stats.completedDays}일을 성공적으로 완료했어요!
          </p>
        </CardContent>
      </Card>

      {/* 주요 통계 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">{stats.currentStreak}</p>
            <p className="text-sm text-gray-600">현재 연속</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{stats.longestStreak}</p>
            <p className="text-sm text-gray-600">최고 기록</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{stats.successRate}%</p>
            <p className="text-sm text-gray-600">성공률</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{stats.completedDays}</p>
            <p className="text-sm text-gray-600">총 완료일</p>
          </CardContent>
        </Card>
      </div>

      {/* 진행률 */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            전체 진행률
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">목표 달성률</span>
                <span className="text-sm font-medium">{stats.successRate}%</span>
              </div>
              <Progress value={stats.successRate} className="h-3" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <p className="text-gray-600">시작한 지</p>
                <p className="font-semibold">{stats.totalDays}일</p>
              </div>
              <div>
                <p className="text-gray-600">성공한 날</p>
                <p className="font-semibold text-green-600">{stats.completedDays}일</p>
              </div>
              <div>
                <p className="text-gray-600">이번 주</p>
                <p className="font-semibold text-blue-600">{stats.thisWeekSuccess}일</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 주간 트렌드 */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            주간 성공률 트렌드
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value}%`, '성공률']}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="successRate" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 일일 성과 */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            최근 7일 성과
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 1]} tickFormatter={(value) => value ? '완료' : '미완료'} />
              <Tooltip 
                formatter={(value) => [value ? '완료' : '미완료', '상태']}
                labelFormatter={(label, payload) => 
                  payload && payload[0] ? `${payload[0].payload.date} (${label})` : label
                }
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 목표 정보 */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            현재 목표 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">목표</span>
              <span className="font-medium">{goal?.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">소요 시간</span>
              <span className="font-medium">{goal?.duration}분</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">빈도</span>
              <Badge variant="secondary">
                {goal?.frequency === 'daily' && '매일'}
                {goal?.frequency === 'weekdays' && '주중'}
                {goal?.frequency === 'alternate' && '격일'}
                {goal?.frequency === 'weekly' && '주 3회'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">시작 시간</span>
              <span className="font-medium">{goal?.time}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
