import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface RoutineData {
  status: string;
  routine: {
    id: number;
    title: string;
    color: string;
  };
  color: string;
}

interface DayData {
  [routineId: string]: RoutineData;
}

interface CalendarData {
  [dateStr: string]: DayData;
}

const CalendarView = ({ routines }: { routines: any[] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState<CalendarData>({});

  useEffect(() => {
    loadCalendarData();
  }, [routines, currentDate]);

  const loadCalendarData = () => {
    const data: CalendarData = {};
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // 이번 달의 모든 날짜에 대해 데이터 로드
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toDateString();
      data[dateStr] = {};
      
      routines.forEach(routine => {
        const status = localStorage.getItem(`routine_${routine.id}_${dateStr}`);
        if (status) {
          data[dateStr][routine.id] = {
            status,
            routine,
            color: routine.color
          };
        }
      });
    }
    
    setCalendarData(data);
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // 이전 달의 빈 칸들
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // 이번 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push(date);
    }
    
    return days;
  };

  const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'bg-blue-500': 'bg-blue-400',
      'bg-green-500': 'bg-green-400',
      'bg-purple-500': 'bg-purple-400',
      'bg-pink-500': 'bg-pink-400',
      'bg-indigo-500': 'bg-indigo-400',
      'bg-red-500': 'bg-red-400',
      'bg-orange-500': 'bg-orange-400',
      'bg-teal-500': 'bg-teal-400'
    };
    return colorMap[color] || 'bg-gray-400';
  };

  const days = getDaysInMonth();
  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="space-y-6">
      {/* 루틴 범례 */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            {routines.map((routine) => (
              <Badge 
                key={routine.id} 
                className={`${routine.color} text-white border-0`}
              >
                {routine.title}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 달력 */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">
              {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateMonth(-1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateMonth(1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayNames.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              if (!date) {
                return <div key={index} className="p-2 h-20"></div>;
              }
              
              const dateStr = date.toDateString();
              const dayData = calendarData[dateStr] || {};
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <div 
                  key={index} 
                  className={`p-2 h-20 border rounded-lg ${
                    isToday ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200'
                  } hover:bg-gray-50 transition-colors`}
                >
                  <div className="text-sm font-medium mb-1">
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {Object.values(dayData).map((item: RoutineData, idx) => (
                      <div 
                        key={idx}
                        className={`w-full h-2 rounded-full ${
                          item.status === 'completed' 
                            ? getColorClass(item.color)
                            : 'bg-gray-300'
                        }`}
                        title={`${item.routine.title} - ${
                          item.status === 'completed' ? '완료' : '건너뜀'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;
