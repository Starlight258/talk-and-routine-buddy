
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Target, Plus, X, CheckCircle } from 'lucide-react';

const SuccessCriteriaSetup = ({ onCriteriaSet, initialCriteria = [] }) => {
  const [criteria, setCriteria] = useState(initialCriteria);
  const [newCriterion, setNewCriterion] = useState('');
  
  const presetCriteria = [
    { text: '정해진 시간에 시작하기', category: 'timing' },
    { text: '최소 80% 집중도 유지하기', category: 'quality' },
    { text: '전체 시간 완주하기', category: 'completion' },
    { text: '준비물 미리 챙기기', category: 'preparation' },
    { text: '진행 상황 기록하기', category: 'tracking' }
  ];

  const addCriterion = (text) => {
    if (text.trim() && !criteria.some(c => c.text === text.trim())) {
      setCriteria(prev => [...prev, { 
        id: Date.now(), 
        text: text.trim(), 
        isCustom: true 
      }]);
      setNewCriterion('');
    }
  };

  const addPresetCriterion = (preset) => {
    if (!criteria.some(c => c.text === preset.text)) {
      setCriteria(prev => [...prev, { 
        id: Date.now(), 
        text: preset.text, 
        category: preset.category,
        isCustom: false 
      }]);
    }
  };

  const removeCriterion = (id) => {
    setCriteria(prev => prev.filter(c => c.id !== id));
  };

  const handleNext = () => {
    onCriteriaSet(criteria);
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          성공 기준 설정하기
        </CardTitle>
        <p className="text-gray-600">
          루틴을 성공적으로 완료했다고 볼 수 있는 기준을 설정해주세요
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 선택된 기준들 */}
        {criteria.length > 0 && (
          <div>
            <Label className="text-sm font-medium mb-2 block">선택된 성공 기준</Label>
            <div className="space-y-2">
              {criteria.map((criterion) => (
                <div key={criterion.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-800">{criterion.text}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCriterion(criterion.id)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 추천 기준들 */}
        <div>
          <Label className="text-sm font-medium mb-3 block">💡 추천 성공 기준</Label>
          <div className="grid gap-2">
            {presetCriteria.map((preset, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:bg-indigo-50 border-indigo-200 transition-colors"
                onClick={() => addPresetCriterion(preset)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{preset.text}</span>
                      <Badge variant="secondary" className="text-xs">
                        {preset.category === 'timing' && '시간 관리'}
                        {preset.category === 'quality' && '품질'}
                        {preset.category === 'completion' && '완주'}
                        {preset.category === 'preparation' && '준비'}
                        {preset.category === 'tracking' && '추적'}
                      </Badge>
                    </div>
                    <Plus className="w-4 h-4 text-indigo-600" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 커스텀 기준 추가 */}
        <div>
          <Label className="text-sm font-medium mb-2 block">직접 추가하기</Label>
          <div className="flex gap-2">
            <Input
              placeholder="예: 매일 같은 시간에 시작하기"
              value={newCriterion}
              onChange={(e) => setNewCriterion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCriterion(newCriterion)}
              className="flex-1"
            />
            <Button 
              onClick={() => addCriterion(newCriterion)}
              disabled={!newCriterion.trim()}
              size="sm"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="pt-4">
          <Button 
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            size="lg"
          >
            다음 단계로 ({criteria.length}개 기준 설정됨)
          </Button>
          <p className="text-center text-sm text-gray-500 mt-2">
            나중에 언제든 수정할 수 있어요
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuccessCriteriaSetup;
