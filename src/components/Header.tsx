import { Button } from '@/components/ui/button';
import { PawPrint } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const { toast } = useToast();

  const handleLogin = () => {
    toast({
      title: '로그인',
      description: '로그인 기능은 준비 중입니다.',
    });
  };

  const handleSignup = () => {
    toast({
      title: '회원가입',
      description: '회원가입 기능은 준비 중입니다.',
    });
  };
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <PawPrint className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">포에버홈</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">소개</a>
            <a href="#animals" className="text-muted-foreground hover:text-foreground transition-colors">입양하기</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">후원하기</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">커뮤니티</a>
          </nav>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              className="hidden sm:inline-flex"
              onClick={handleLogin}
            >
              로그인
            </Button>
            <Button onClick={handleSignup}>
              회원가입
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
