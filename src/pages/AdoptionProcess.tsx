import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ClipboardCheck, CalendarCheck, FileText, Home, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdoptionProcess = () => {
  const steps = [
    {
      icon: ClipboardCheck,
      title: '입양 전 확인',
      description: '동물보호관리시스템(animal.go.kr) 홈페이지에서 "유실·유기동물 공고" → "보호중 동물 입양 요청" 확인',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: CalendarCheck,
      title: '입양 상담 예약',
      description: '동물보호센터 방문 전, 교감현장 참여 후 전화확인 및 날짜 및 일정 상담 예약',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      icon: FileText,
      title: '입양 신청',
      description: '유실·유기동물 입양 희망 시 서류 작성 등 입양 신청 ※ 실물 확인은 위해 가능할 경우 방문 후 신청서를 작성해주시면 좋습니다.',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Home,
      title: '입양 완료',
      description: '동물의 건강상태·특성에 대한 충분한 설명과 동물등록, 수의적 검술, 이력관리 교육 완료 후 입양 진행',
      color: 'bg-pink-100 text-pink-600',
    },
  ];

  const supportInfo = [
    { title: '대상', description: '동물보호센터에서 유기·유실 동물을 반려동물로 입양한 경우' },
    { title: '지원', description: '입양 시 소요되는 전액비, 수술비, 예방접종, 중성화 수술, 비용, 보험료 등 소모비용의 100% 지원' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          홈으로 돌아가기
        </Link>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6 md:p-10 mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            유실·유기동물 입양, <span className="text-primary">당신의 선택이</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            한 생명의 삶을 바꿀 수 있습니다.
          </h2>
          <p className="text-muted-foreground">유실·유기동물에게 따뜻한 가족의 품을 찾아주세요.</p>
        </div>

        {/* Process Steps */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            유실·유기동물 입양 절차
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, index) => (
              <Card key={index} className="border-0 shadow-md relative overflow-hidden">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center mb-4`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                      STEP {index + 1}
                    </span>
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                    <ArrowRight className="w-5 h-5 text-muted-foreground/50" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Support Info */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-success rounded-full"></span>
            유실·유기동물 입양비 지원 사업
          </h2>
          
          <Card className="border-0 shadow-md bg-success/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                <p className="text-foreground">
                  동물보호센터에서 얼마 유기동물을 반려동물로 입양 시 발생하는 비용을 일정 수준으로 지원하여 유실 유기동물의 입양 활성화
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                {supportInfo.map((info, index) => (
                  <div key={index} className="bg-card rounded-lg p-4">
                    <span className="text-sm font-semibold text-primary">{info.title}</span>
                    <p className="text-sm text-muted-foreground mt-1">{info.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Education Info */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-badge-female rounded-full"></span>
            반려동물 입양 예정자 교육
          </h2>
          
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-6">
                반려동물과 사람의 행복한 동거를 위해 성숙한 반려인이 될 수 있도록 길잡이를 돕고 기본 양육정보를 제공하는 동물에 대한 이해를 돕고 기본 양육정보를 제공합니다.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm font-medium text-foreground">동물사랑 배움터</p>
                  <p className="text-xs text-muted-foreground mt-1">(apms.epis.or.kr)</p>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm font-medium text-foreground">교육</p>
                  <p className="text-xs text-muted-foreground mt-1">반려동물 양육 교육</p>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm font-medium text-foreground">검사</p>
                  <p className="text-xs text-muted-foreground mt-1">교육 완료 후 검사</p>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm font-medium text-foreground">수료증</p>
                  <p className="text-xs text-muted-foreground mt-1">1~4차시</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <div className="text-center py-8">
          <Link to="/#animals">
            <Button size="lg" className="gap-2">
              입양 가능한 동물 보기
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AdoptionProcess;
