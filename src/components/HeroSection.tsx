import { motion } from 'framer-motion';
import { Heart, ArrowRight, Sparkles, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccount, useConnect } from 'wagmi';

export const HeroSection = () => {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  const handleConnect = () => {
    const injectedConnector = connectors.find(c => c.id === 'injected');
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };

  const stats = [
    { label: '活跃用户', value: '12,580+', icon: Users },
    { label: '善意行为', value: '89,234', icon: Heart },
    { label: '事件追踪', value: '3,567', icon: Shield },
  ];

  return (
    <section id="home" className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-kindflow-teal/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-kindflow-coral/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-kindflow-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kindflow-teal-light border border-primary/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Web3 善意生态平台</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            让
            <span className="text-gradient-hero"> 善意 </span>
            流动起来
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            通过区块链技术记录每一次善行，用善意币激励互助行为，
            构建可持续的公益互助生态系统
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            {isConnected ? (
              <>
                <Button variant="hero" size="xl">
                  发布求助任务
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="xl">
                  浏览互助任务
                </Button>
              </>
            ) : (
              <>
                <Button variant="hero" size="xl" onClick={handleConnect}>
                  连接钱包开始
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="xl">
                  了解更多
                </Button>
              </>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-card border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-kindflow-teal-light flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gradient-hero mb-1">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 right-[10%] hidden lg:block"
        >
          <div className="w-16 h-16 rounded-2xl bg-kindflow-coral-light flex items-center justify-center shadow-card">
            <Heart className="w-8 h-8 text-kindflow-coral" />
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 left-[10%] hidden lg:block"
        >
          <div className="w-14 h-14 rounded-2xl bg-kindflow-gold-light flex items-center justify-center shadow-card">
            <Sparkles className="w-7 h-7 text-kindflow-gold" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
