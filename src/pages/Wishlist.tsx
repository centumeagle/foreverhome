import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useWishlist } from '@/hooks/useWishlist';
import Header from '@/components/Header';
import AnimalCard from '@/components/AnimalCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const Wishlist = () => {
  const { user, loading: authLoading } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchWishlistAnimals = async () => {
      if (wishlist.length === 0) {
        setAnimals([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('abandoned_animals')
          .select('*')
          .in('id', wishlist);

        if (error) throw error;
        setAnimals(data || []);
      } catch (error) {
        console.error('Error fetching wishlist animals:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchWishlistAnimals();
    }
  }, [wishlist, user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          홈으로 돌아가기
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-badge-female/20 rounded-full flex items-center justify-center">
            <Heart className="w-5 h-5 text-badge-female" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">찜 목록</h1>
            <p className="text-muted-foreground text-sm">관심 있는 동물들을 모아봤어요</p>
          </div>
        </div>

        {animals.length === 0 ? (
          <div className="bg-card rounded-2xl p-12 text-center shadow-sm">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">아직 찜한 동물이 없어요</p>
            <Link to="/">
              <Button>동물 보러가기</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {animals.map((animal, index) => (
              <AnimalCard key={animal.id} animal={animal} index={index} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
