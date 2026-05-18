import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AIRecommendModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AIRecommendModal = ({ open, onOpenChange }: AIRecommendModalProps) => {
  const [userInput, setUserInput] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRecommend = async () => {
    if (!userInput.trim()) {
      toast({
        title: '입력 필요',
        description: '거주 환경과 성향을 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    if (userInput.length > 1000) {
      toast({
        title: '입력 초과',
        description: '1000자 이내로 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setRecommendation('');

    try {
      const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      if (!GEMINI_API_KEY) {
        throw new Error('VITE_GEMINI_API_KEY가 .env에 설정되지 않았습니다.');
      }

      const systemPrompt = "당신은 동물 보호소 상담사입니다. 사용자의 환경을 분석하여 적합한 반려동물을 추천하고 따뜻한 말투로 조언해주세요. 한국어로 응답해주세요.";

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: `${systemPrompt}\n\n사용자 정보:\n${userInput}\n\n위 정보를 바탕으로 적합한 반려동물 종류와 품종을 추천하고, 양육 시 주의사항과 조언을 친절하게 알려주세요.` }]
            }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
          })
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API 오류: ${response.status} ${errText}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        setRecommendation(text);
      } else {
        throw new Error('추천 결과를 받지 못했습니다.');
      }
    } catch (error) {
      console.error('AI recommendation error:', error);
      toast({
        title: '오류',
        description: error instanceof Error ? error.message : 'AI 추천을 받는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setUserInput('');
    setRecommendation('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI 맞춤 동물 추천
          </DialogTitle>
          <DialogDescription>
            거주 환경과 성향을 알려주시면 적합한 반려동물을 추천해드려요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              거주 환경 및 성향
            </label>
            <Textarea
              placeholder="예: 아파트에 살고 있고, 혼자 거주합니다. 재택근무를 해서 집에 있는 시간이 많아요. 조용한 성격이고 산책은 주 2-3회 정도 가능합니다."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {userInput.length}/1000
            </p>
          </div>

          <Button 
            onClick={handleRecommend} 
            className="w-full h-12 gap-2"
            disabled={loading || !userInput.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                추천 중...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                추천받기
              </>
            )}
          </Button>

          {recommendation && (
            <div className="bg-secondary/50 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                AI 추천 결과
              </h4>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {recommendation}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIRecommendModal;
