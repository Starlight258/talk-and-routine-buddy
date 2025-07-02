
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const ApiKeySetup = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');

  const validateApiKey = async (key) => {
    if (!key || key.length < 10) {
      throw new Error('API 키가 너무 짧습니다.');
    }

    // Google Gemini API로 간단한 테스트 요청
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "안녕하세요"
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 10,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('API 검증 오류:', errorData);
      
      if (errorData.error?.message?.includes('API key expired')) {
        throw new Error('API 키가 만료되었습니다. 새로운 키를 생성해주세요.');
      } else if (errorData.error?.message?.includes('API key not valid')) {
        throw new Error('API 키가 유효하지 않습니다. 키를 다시 확인해주세요.');
      } else {
        throw new Error(`API 키 검증 실패: ${errorData.error?.message || '알 수 없는 오류'}`);
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsValidating(true);
    setError('');

    try {
      await validateApiKey(apiKey);
      localStorage.setItem('gemini_api_key', apiKey);
      onApiKeySet(apiKey);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsValidating(false);
    }
  };

  const clearApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
              <Key className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Google Gemini API 설정
            </CardTitle>
            <p className="text-gray-600 mt-2">
              AI 코치와 대화하기 위해 Google Gemini API 키를 입력해주세요
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API 키</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="AIza..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="font-mono"
                />
              </div>
              
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-700">
                    <p className="font-medium">오류가 발생했습니다</p>
                    <p>{error}</p>
                    {error.includes('만료') && (
                      <p className="mt-1">새로운 API 키를 생성하거나 기존 키를 갱신해주세요.</p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  disabled={!apiKey || isValidating}
                >
                  {isValidating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      검증 중...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      API 키 설정
                    </>
                  )}
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={clearApiKey}
                  disabled={isValidating}
                >
                  초기화
                </Button>
              </div>
            </form>
            
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>📝 API 키 받는 방법:</strong><br/>
                  1. <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-medium">Google AI Studio</a>에 접속<br/>
                  2. Google 계정으로 로그인<br/>
                  3. "Create API Key" 클릭<br/>
                  4. 생성된 키를 복사해서 위에 입력
                </p>
              </div>
              
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>⚠️ 주의사항:</strong><br/>
                  • API 키는 브라우저에만 저장됩니다<br/>
                  • 개인정보이므로 타인과 공유하지 마세요<br/>
                  • 문제가 생기면 새로운 키를 생성하세요
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiKeySetup;
