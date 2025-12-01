import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, MapPin, Phone, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

const Index = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'dog' | 'cat' | 'other'>('all');
  const { toast } = useToast();
  const itemsPerPage = 15;

  const fetchAnimals = async () => {
    try {
      // Get total count
      const { count } = await supabase
        .from('abandoned_animals')
        .select('*', { count: 'exact', head: true });
      
      setTotalCount(count || 0);

      // Get all data
      const { data, error } = await supabase
        .from('abandoned_animals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnimals(data || []);
    } catch (error) {
      console.error('Error fetching animals:', error);
      toast({
        title: '오류',
        description: '데이터를 불러오는데 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateData = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-animals');
      
      if (error) throw error;

      toast({
        title: '성공',
        description: '데이터 수집을 시작했습니다. 잠시 후 새로고침하세요.',
      });

      // 5초 후 자동으로 데이터 새로고침
      setTimeout(() => {
        fetchAnimals();
      }, 5000);
    } catch (error) {
      console.error('Error updating data:', error);
      toast({
        title: '오류',
        description: '데이터 업데이트에 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const getCategoryFromKind = (kindcd: string | null): 'dog' | 'cat' | 'other' => {
    if (!kindcd) return 'other';
    const kind = kindcd.toLowerCase();
    if (kind.startsWith('[개]') || kind.includes('개') || kind.includes('dog')) return 'dog';
    if (kind.startsWith('[고양이]') || kind.includes('고양이') || kind.includes('cat')) return 'cat';
    return 'other';
  };

  const filteredAnimals = animals.filter(animal => {
    if (selectedCategory === 'all') return true;
    return getCategoryFromKind(animal.kindcd) === selectedCategory;
  });

  const totalPages = Math.ceil(filteredAnimals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAnimals = filteredAnimals.slice(startIndex, endIndex);

  const dogCount = animals.filter(a => getCategoryFromKind(a.kindcd) === 'dog').length;
  const catCount = animals.filter(a => getCategoryFromKind(a.kindcd) === 'cat').length;
  const otherCount = animals.filter(a => getCategoryFromKind(a.kindcd) === 'other').length;

  const getProcessStateBadge = (state: string | null) => {
    if (!state) return <Badge variant="secondary">알 수 없음</Badge>;
    
    switch (state) {
      case '보호중':
        return <Badge variant="default">보호중</Badge>;
      case '종료(입양)':
        return <Badge className="bg-green-600">입양됨</Badge>;
      case '종료(자연사)':
        return <Badge variant="secondary">종료</Badge>;
      default:
        return <Badge variant="outline">{state}</Badge>;
    }
  };

  const getSexText = (sex: string | null) => {
    if (!sex) return '성별 미상';
    return sex === 'M' ? '수컷' : sex === 'F' ? '암컷' : sex === 'Q' ? '미상' : sex;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">유기동물 보호 현황</h1>
            <p className="text-muted-foreground">
              총 {totalCount}개의 유기동물 정보 (개: {dogCount}, 고양이: {catCount}, 기타: {otherCount})
            </p>
          </div>
          <Button onClick={updateData} disabled={fetching} size="lg">
            <RefreshCw className={`w-4 h-4 mr-2 ${fetching ? 'animate-spin' : ''}`} />
            데이터 업데이트
          </Button>
        </div>

        <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all">전체 ({animals.length})</TabsTrigger>
            <TabsTrigger value="dog">개 ({dogCount})</TabsTrigger>
            <TabsTrigger value="cat">고양이 ({catCount})</TabsTrigger>
            <TabsTrigger value="other">기타 ({otherCount})</TabsTrigger>
          </TabsList>
        </Tabs>

        {filteredAnimals.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">등록된 동물 정보가 없습니다.</p>
              <Button onClick={updateData} disabled={fetching}>
                <RefreshCw className={`w-4 h-4 mr-2 ${fetching ? 'animate-spin' : ''}`} />
                데이터 가져오기
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentAnimals.map((animal) => (
              <Card key={animal.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {animal.popfile && (
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img
                      src={animal.popfile}
                      alt={animal.kindcd || '동물 사진'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {animal.kindcd || '품종 미상'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {getSexText(animal.sexcd)} • {animal.age || '나이 미상'}
                      </p>
                    </div>
                    {getProcessStateBadge(animal.processstate)}
                  </div>

                  {animal.specialmark && (
                    <p className="text-sm mb-3 text-muted-foreground line-clamp-2">
                      {animal.specialmark}
                    </p>
                  )}

                  <div className="space-y-2 text-sm">
                    {animal.carenm && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{animal.carenm}</span>
                      </div>
                    )}
                    {animal.caretel && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span>{animal.caretel}</span>
                      </div>
                    )}
                    {animal.happendt && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span>{animal.happendt}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  이전
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {currentPage} / {totalPages} 페이지
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({startIndex + 1}-{Math.min(endIndex, filteredAnimals.length)} / {filteredAnimals.length}개)
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  다음
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
