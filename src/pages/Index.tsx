import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { TasksSection } from '@/components/TasksSection';
import { EventsSection } from '@/components/EventsSection';
import { TokenSection } from '@/components/TokenSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <TasksSection />
        <EventsSection />
        <TokenSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
