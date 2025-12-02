import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useWishlist = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('animal_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setWishlist(data?.map(w => w.animal_id) || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (animalId: string) => {
    if (!user) return false;

    const isInWishlist = wishlist.includes(animalId);

    try {
      if (isInWishlist) {
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('animal_id', animalId);

        if (error) throw error;
        setWishlist(prev => prev.filter(id => id !== animalId));
      } else {
        const { error } = await supabase
          .from('wishlists')
          .insert({ user_id: user.id, animal_id: animalId });

        if (error) throw error;
        setWishlist(prev => [...prev, animalId]);
      }
      return true;
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      return false;
    }
  };

  const isInWishlist = (animalId: string) => wishlist.includes(animalId);

  return { wishlist, loading, toggleWishlist, isInWishlist, fetchWishlist };
};
