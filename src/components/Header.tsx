import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PawPrint, Menu, X, Heart, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <PawPrint className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">포에버홈</span>
          </Link>
          
          {/* Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/wishlist">
                  <Button variant="ghost" className="gap-2">
                    <Heart className="w-4 h-4" />
                    찜 목록
                  </Button>
                </Link>
                <Button variant="ghost" onClick={handleSignOut} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost">로그인</Button>
                </Link>
                <Link to="/auth">
                  <Button>회원가입</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-11 w-11">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] p-0">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <PawPrint className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <span className="font-bold text-foreground">포에버홈</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-4 space-y-2">
                    {user ? (
                      <>
                        <p className="text-sm text-muted-foreground mb-4 px-2">
                          {user.email}
                        </p>
                        <Link to="/wishlist" onClick={() => setOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start gap-2 h-12">
                            <Heart className="w-5 h-5" />
                            찜 목록
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          onClick={handleSignOut}
                          className="w-full justify-start gap-2 h-12"
                        >
                          <LogOut className="w-5 h-5" />
                          로그아웃
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link to="/auth" onClick={() => setOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start h-12">
                            로그인
                          </Button>
                        </Link>
                        <Link to="/auth" onClick={() => setOpen(false)}>
                          <Button className="w-full h-12">
                            회원가입
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
