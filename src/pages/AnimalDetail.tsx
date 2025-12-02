import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Phone, MapPin, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

interface Animal {
  id: string;
  desertionno: string;
  kindcd: string | null;
  age: string | null;
  weight: string | null;
  sexcd: string | null;
  neuteryn: string | null;
  specialmark: string | null;
  carenm: string | null;
  caretel: string | null;
  careaddr: string | null;
  happendt: string | null;
  happenplace: string | null;
  noticesdt: string | null;
  noticeedt: string | null;
  popfile: string | null;
  processstate: string | null;
  colorcd: string | null;
}

const AnimalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimal = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('abandoned_animals')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setAnimal(data);
      } catch (error) {
        console.error('Error fetching animal:', error);
        toast({
          title: '오류',
          description: '동물 정보를 불러오는데 실패했습니다.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [id, toast]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '정보 없음';
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${year}.${month}.${day}`;
  };

  const getSexText = (sex: string | null) => {
    if (!sex) return '미상';
    return sex === 'M' ? '수컷' : sex === 'F' ? '암컷' : '미상';
  };

  const getNeuterText = (neuter: string | null) => {
    if (!neuter) return '미완료';
    return neuter === 'Y' ? '완료' : neuter === 'N' ? '미완료' : '미상';
  };

  const getBreedName = (kindcd: string | null) => {
    if (!kindcd) return '품종 미상';
    return kindcd.replace(/^\[(개|고양이|기타축종)\]\s*/, '') || '품종 미상';
  };

  const getCategory = (kindcd: string | null) => {
    if (!kindcd) return '기타';
    const kind = kindcd.toLowerCase();
    if (kind.startsWith('[개]') || kind.includes('개')) return '개';
    if (kind.startsWith('[고양이]') || kind.includes('고양이')) return '고양이';
    return '기타';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">동물 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로
        </Button>

        {/* Main content */}
        <div className="bg-card rounded-2xl overflow-hidden shadow-lg">
          {/* Image */}
          <div className="relative w-full aspect-video bg-muted">
            {animal.popfile ? (
              <img
                src={animal.popfile}
                alt={animal.kindcd || '동물 사진'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                사진 없음
              </div>
            )}
            <div className="absolute top-4 right-4">
              <Badge className="bg-success text-white text-base px-4 py-1">
                보호중
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Category */}
            <div className="mb-4">
              <span className="text-sm text-muted-foreground">{getCategory(animal.kindcd)}</span>
            </div>

            {/* ID */}
            <h1 className="text-3xl font-bold text-foreground mb-8">{animal.desertionno}</h1>

            {/* Info sections */}
            <div className="space-y-8">
              {/* Basic Info */}
              <div>
                <h2 className="text-lg font-bold text-foreground mb-4 pb-2 border-b border-border">
                  기본 정보
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">유기번호</p>
                    <p className="text-foreground">{animal.desertionno}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">접수일</p>
                    <p className="text-foreground">{formatDate(animal.happendt)}</p>
                  </div>
                </div>
              </div>

              {/* Status Info */}
              <div>
                <h2 className="text-lg font-bold text-foreground mb-4 pb-2 border-b border-border">
                  상태 정보
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">상태</p>
                    <p className="text-foreground">{animal.processstate || '정보 없음'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">중성화</p>
                    <p className="text-foreground flex items-center gap-2">
                      {getNeuterText(animal.neuteryn) === '완료' && (
                        <span className="text-success">⭕</span>
                      )}
                      {getNeuterText(animal.neuteryn)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">공고번호</p>
                    <p className="text-foreground">{animal.desertionno}</p>
                  </div>
                </div>
              </div>

              {/* Physical Info */}
              <div>
                <h2 className="text-lg font-bold text-foreground mb-4 pb-2 border-b border-border">
                  품종
                </h2>
                <p className="text-foreground mb-6">{getBreedName(animal.kindcd)}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">나이</p>
                    <p className="text-foreground">{animal.age || '미상'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">체중</p>
                    <p className="text-foreground">{animal.weight || '미상'}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-1">색상</p>
                  <p className="text-foreground">{animal.colorcd || '정보 없음'}</p>
                </div>
              </div>

              {/* Discovery Info */}
              <div>
                <h2 className="text-lg font-bold text-foreground mb-4 pb-2 border-b border-border">
                  발견 정보
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      발견장소
                    </p>
                    <p className="text-foreground">{animal.happenplace || '정보 없음'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">공고기간</p>
                    <p className="text-foreground">
                      {formatDate(animal.noticesdt)} ~ {formatDate(animal.noticeedt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Special Mark */}
              {animal.specialmark && (
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-4 pb-2 border-b border-border">
                    특징
                  </h2>
                  <p className="text-foreground leading-relaxed">{animal.specialmark}</p>
                </div>
              )}

              {/* Shelter Info */}
              <div>
                <h2 className="text-lg font-bold text-foreground mb-4 pb-2 border-b border-border">
                  보호소 정보
                </h2>
                <div className="bg-warm-beige/30 rounded-xl p-6 space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">보호소명</p>
                    <p className="text-foreground font-medium">{animal.carenm || '정보 없음'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      전화번호
                    </p>
                    <a 
                      href={`tel:${animal.caretel}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {animal.caretel || '정보 없음'}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">주소</p>
                    <p className="text-foreground">{animal.careaddr || '정보 없음'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 mt-8">
              <Button 
                className="flex-1 h-14 text-lg"
                onClick={() => {
                  if (animal.caretel) {
                    window.location.href = `tel:${animal.caretel}`;
                  }
                }}
              >
                <Phone className="w-5 h-5 mr-2" />
                입양 문의하기
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="h-14 px-6"
              >
                <Heart className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2024 포에버홈. 모든 생명은 소중합니다.</p>
        </div>
      </footer>
    </div>
  );
};

export default AnimalDetail;
