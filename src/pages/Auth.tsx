import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { PawPrint, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().trim().email({ message: '유효한 이메일을 입력해주세요' }).max(255),
  password: z.string().min(6, { message: '비밀번호는 6자 이상이어야 합니다' }).max(100),
});

const Auth = () => {
  const { user, signUp, signIn, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleAuth = async (type: 'signin' | 'signup') => {
    try {
      const validated = authSchema.parse({ email, password });
      setIsSubmitting(true);

      const { error } = type === 'signup' 
        ? await signUp(validated.email, validated.password)
        : await signIn(validated.email, validated.password);

      if (error) {
        let message = error.message;
        if (error.message.includes('User already registered')) {
          message = '이미 가입된 이메일입니다.';
        } else if (error.message.includes('Invalid login credentials')) {
          message = '이메일 또는 비밀번호가 올바르지 않습니다.';
        }
        toast({
          title: '오류',
          description: message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: type === 'signup' ? '회원가입 완료' : '로그인 성공',
        description: type === 'signup' ? '환영합니다!' : '다시 만나서 반가워요!',
      });
      navigate('/');
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          title: '입력 오류',
          description: err.errors[0].message,
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />
          홈으로 돌아가기
        </Link>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <PawPrint className="w-7 h-7 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">포에버홈</CardTitle>
            <CardDescription>새로운 가족을 찾아주세요</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">로그인</TabsTrigger>
                <TabsTrigger value="signup">회원가입</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <Input
                  type="email"
                  placeholder="이메일"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                />
                <Input
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                />
                <Button 
                  onClick={() => handleAuth('signin')} 
                  className="w-full h-12"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '로그인 중...' : '로그인'}
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <Input
                  type="email"
                  placeholder="이메일"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                />
                <Input
                  type="password"
                  placeholder="비밀번호 (6자 이상)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                />
                <Button 
                  onClick={() => handleAuth('signup')} 
                  className="w-full h-12"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '가입 중...' : '회원가입'}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
