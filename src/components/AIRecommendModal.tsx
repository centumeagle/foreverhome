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
      const { data, error } = await supabase.functions.invoke('ai-recommend', {
        body: { userInput }
      });

      if (error) throw error;

      if (data?.recommendation) {
        setRecommendation(data.recommendation);
      } else {
        throw new Error('추천 결과를 받지 못했습니다.');
      }
    } catch (error) {
      console.error('AI recommendation error:', error);
      toast({
        title: '오류',
        description: 'AI 추천을 받는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
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
