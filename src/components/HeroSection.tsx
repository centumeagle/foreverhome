import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import AIRecommendModal from './AIRecommendModal';

const HeroSection = () => {
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const scrollToAnimals = () => {
    const animalsSection = document.getElementById('animals');
    if (animalsSection) {
      animalsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="bg-background py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-sm text-muted-foreground">
                <Heart className="w-4 h-4 text-badge-female" />
                사지 말고 입양하세요
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                작은 생명에게<br />
                기적이 되어주세요
              </h1>
              
              <p className="text-base md:text-lg text-muted-foreground max-w-md">
                따뜻한 손길을 기다리는 아이들이 있습니다.<br />
                당신의 사랑으로 새로운 가족을 만들어주세요.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  size="lg" 
                  className="gap-2 h-12"
                  onClick={scrollToAnimals}
                >
                  친구들 만나러 가기
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Link to="/adoption-process">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="w-full sm:w-auto h-12"
                  >
                    입양 절차 안내
                  </Button>
                </Link>
              </div>

              <Button 
                variant="secondary" 
                size="lg"
                className="gap-2 h-12 w-full sm:w-auto"
                onClick={() => setAiModalOpen(true)}
              >
                <Sparkles className="w-4 h-4" />
                AI 맞춤 동물 추천받기
              </Button>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop"
                  alt="입양을 기다리는 강아지"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-foreground/70 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-primary-foreground text-sm md:text-base font-medium">
                    "저의 가족이 되어주시겠어요?"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AIRecommendModal open={aiModalOpen} onOpenChange={setAiModalOpen} />
    </>
  );
};

export default HeroSection;
