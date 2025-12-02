import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, ChevronLeft, ChevronRight, ChevronRight as ArrowIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AnimalCard from '@/components/AnimalCard';

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
  const itemsPerPage = 12;

  const fetchAnimals = async () => {
    try {
      const { count } = await supabase
        .from('abandoned_animals')
        .select('*', { count: 'exact', head: true });
      
      setTotalCount(count || 0);

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
      <Header />
      <HeroSection />
      
      {/* Animals Section */}
      <section id="animals" className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                가족을 기다리고 있어요
              </h2>
              <p className="text-muted-foreground">
                새로운 삶을 함께할 평생 가족을 찾습니다.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={updateData} 
                disabled={fetching}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${fetching ? 'animate-spin' : ''}`} />
                데이터 업데이트
              </Button>
              <Button 
                variant="link" 
                className="gap-1 text-primary"
                onClick={() => {
                  const animalsSection = document.getElementById('animals');
                  if (animalsSection) {
                    animalsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                모두 보기
                <ArrowIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)} className="mb-8">
            <TabsList className="bg-secondary/50 p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">
                전체 ({animals.length})
              </TabsTrigger>
              <TabsTrigger value="dog" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">
                강아지 ({dogCount})
              </TabsTrigger>
              <TabsTrigger value="cat" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">
                고양이 ({catCount})
              </TabsTrigger>
              <TabsTrigger value="other" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">
                기타 ({otherCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {filteredAnimals.length === 0 ? (
            <div className="bg-card rounded-2xl p-12 text-center shadow-sm">
              <p className="text-muted-foreground mb-4">등록된 동물 정보가 없습니다.</p>
              <Button onClick={updateData} disabled={fetching}>
                <RefreshCw className={`w-4 h-4 mr-2 ${fetching ? 'animate-spin' : ''}`} />
                데이터 가져오기
              </Button>
            </div>
          ) : (
            <>
              {/* Animal Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
                {currentAnimals.map((animal, index) => (
                  <AnimalCard 
                    key={animal.id} 
                    animal={animal} 
                    index={startIndex + index} 
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    이전
                  </Button>
                  
                  <div className="flex items-center gap-2 px-4">
                    <span className="text-sm font-medium text-foreground">
                      {currentPage} / {totalPages}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({filteredAnimals.length}마리)
                    </span>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="gap-1"
                  >
                    다음
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2024 포에버홈. 모든 생명은 소중합니다.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
