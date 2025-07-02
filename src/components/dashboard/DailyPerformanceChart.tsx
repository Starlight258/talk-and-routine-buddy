
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DailyData } from './types';

interface DailyPerformanceChartProps {
  data: DailyData[];
}

const DailyPerformanceChart = ({ data }: DailyPerformanceChartProps) => {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          최근 7일 성과
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
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
  );
};

export default DailyPerformanceChart;
