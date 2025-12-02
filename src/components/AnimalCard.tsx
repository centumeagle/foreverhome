import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin } from 'lucide-react';
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

interface AnimalCardProps {
  animal: Animal;
  index: number;
}

const AnimalCard = ({ animal, index }: AnimalCardProps) => {
  const getSexText = (sex: string | null) => {
    if (!sex) return '미상';
    return sex === 'M' ? '남아' : sex === 'F' ? '여아' : '미상';
  };

  const getSexBadgeClass = (sex: string | null) => {
    if (sex === 'F') return 'bg-badge-female text-white';
    if (sex === 'M') return 'bg-badge-male text-white';
    return 'bg-muted text-muted-foreground';
  };

  const getProcessStateBadge = (state: string | null) => {
    if (!state) return null;
    
    if (state === '보호중') {
      return <Badge className="bg-success text-white">입양 가능</Badge>;
    }
    if (state.includes('입양')) {
      return <Badge className="bg-muted text-muted-foreground">입양 완료</Badge>;
    }
    return <Badge variant="secondary">{state}</Badge>;
  };

  const getBreedName = (kindcd: string | null) => {
    if (!kindcd) return '품종 미상';
    // Remove [개], [고양이] prefix and return breed
    return kindcd.replace(/^\[(개|고양이|기타축종)\]\s*/, '') || '품종 미상';
  };

  const getLocationShort = (carenm: string | null) => {
    if (!carenm) return '위치 미상';
    // Shorten the location name
    const parts = carenm.split(' ');
    return parts.slice(0, 2).join(' ');
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group bg-card border-0 shadow-md">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {animal.popfile ? (
          <img
            src={animal.popfile}
            alt={animal.kindcd || '동물 사진'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            사진 없음
          </div>
        )}
        
        {/* Status badge */}
        <div className="absolute top-3 left-3">
          {getProcessStateBadge(animal.processstate)}
        </div>
        
        {/* Index badge */}
        <div className="absolute top-3 left-3 mt-8">
          <Badge className="bg-primary text-primary-foreground">
            D-{index + 1}
          </Badge>
        </div>
        
        {/* Favorite button */}
        <button className="absolute top-3 right-3 w-9 h-9 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors">
          <Heart className="w-5 h-5 text-muted-foreground hover:text-badge-female transition-colors" />
        </button>
      </div>
      
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-foreground">
            {getBreedName(animal.kindcd)}
          </h3>
          <Badge className={getSexBadgeClass(animal.sexcd)}>
            {getSexText(animal.sexcd)}
          </Badge>
        </div>
        
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{getLocationShort(animal.carenm)}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">품종</p>
            <p className="text-sm font-medium text-foreground truncate">
              {getBreedName(animal.kindcd)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">나이</p>
            <p className="text-sm font-medium text-foreground">
              {animal.age || '미상'}
            </p>
          </div>
        </div>
        
        <Link to={`/animal/${animal.id}`}>
          <Button className="w-full" variant="default">
            자세히 보기
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default AnimalCard;
