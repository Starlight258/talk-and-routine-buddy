
export interface FailureReason {
  id: string;
  text: string;
  category: 'time' | 'motivation' | 'health' | 'external' | 'other';
  keywords: string[];
}

export const failureReasons: FailureReason[] = [
  { id: 'time_lack', text: '시간이 부족했어요', category: 'time', keywords: ['시간', '바쁨', '늦음', '급함'] },
  { id: 'motivation_low', text: '의욕이 없었어요', category: 'motivation', keywords: ['의욕', '동기', '귀찮', '하기싫'] },
  { id: 'health_issue', text: '몸이 좋지 않았어요', category: 'health', keywords: ['아픔', '피곤', '감기', '몸살', '아프'] },
  { id: 'external_factor', text: '외부 상황 때문이에요', category: 'external', keywords: ['일정', '약속', '상황', '사정'] },
  { id: 'forgot', text: '깜빡했어요', category: 'other', keywords: ['깜빡', '잊어버림', '기억', '놓쳤'] },
  { id: 'weather', text: '날씨가 안 좋았어요', category: 'external', keywords: ['날씨', '비', '추움', '더움'] },
  { id: 'stress', text: '스트레스가 심했어요', category: 'motivation', keywords: ['스트레스', '힘듦', '우울', '걱정'] }
];

export const analyzeFailureText = (text: string): string[] => {
  const foundReasons: string[] = [];
  const lowerText = text.toLowerCase();
  
  failureReasons.forEach(reason => {
    const hasKeyword = reason.keywords.some(keyword => 
      lowerText.includes(keyword.toLowerCase())
    );
    if (hasKeyword) {
      foundReasons.push(reason.id);
    }
  });
  
  return foundReasons.length > 0 ? foundReasons : ['other'];
};

export const getFailureStats = (routineId: number, days: number = 30) => {
  const stats = {
    total: 0,
    byCategory: {} as Record<string, number>,
    trends: [] as { date: string; category: string; count: number }[]
  };
  
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toDateString();
    
    const reflection = localStorage.getItem(`routine_${routineId}_reflection_${dateStr}`);
    if (reflection) {
      const data = JSON.parse(reflection);
      if (data.completionType === 'skipped' && data.failureReasons) {
        stats.total++;
        data.failureReasons.forEach((reasonId: string) => {
          const reason = failureReasons.find(r => r.id === reasonId);
          if (reason) {
            stats.byCategory[reason.category] = (stats.byCategory[reason.category] || 0) + 1;
          }
        });
      }
    }
  }
  
  return stats;
};
