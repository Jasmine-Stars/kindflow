import { motion } from 'framer-motion';
import { Coins, ArrowUpRight, ArrowDownRight, Gift, Eye, Heart, Award, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';

const earnMethods = [
  { icon: Heart, title: '完成互助任务', description: '帮助他人完成任务获得奖励', amount: '+10~200 KC' },
  { icon: Eye, title: '关注恶性事件', description: '监督公共事件，推动问题解决', amount: '+5~50 KC' },
  { icon: Award, title: '提交有效证据', description: '为事件提供有价值的证据', amount: '+20~100 KC' },
  { icon: Gift, title: '平台活动奖励', description: '参与平台活动获得额外奖励', amount: '+不等' },
];

const spendMethods = [
  { icon: ArrowUpRight, title: '发布求助任务', description: '发布任务并提高曝光度', amount: '-10+ KC' },
  { icon: Eye, title: '关注事件', description: '关注恶性事件需消耗善意币', amount: '-5 KC' },
  { icon: Gift, title: '打赏他人', description: '对完成任务者进行额外打赏', amount: '-自定义' },
  { icon: Award, title: '社区治理', description: '参与社区投票与决策', amount: '-10 KC' },
];

export const TokenSection = () => {
  const { isConnected } = useAccount();

  return (
    <section id="token" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kindflow-gold-light border border-kindflow-gold/20 mb-4">
            <Coins className="w-4 h-4 text-kindflow-gold" />
            <span className="text-sm font-medium text-kindflow-gold">KindCoin</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">善意币经济系统</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            善意币是平台内唯一流通通证，代表您的善行价值。通过帮助他人获取，用于发布任务和社区治理
          </p>
        </motion.div>

        {/* Token Balance Card (for connected users) */}
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-lg mx-auto mb-16"
          >
            <div className="bg-gradient-hero rounded-3xl p-8 text-center shadow-glow">
              <p className="text-primary-foreground/80 mb-2">您的善意币余额</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Coins className="w-10 h-10 text-kindflow-gold" />
                <span className="text-5xl font-bold text-primary-foreground">1,250</span>
                <span className="text-xl text-primary-foreground/80">KC</span>
              </div>
              <div className="flex items-center justify-center gap-4">
                <Button variant="kindcoin" size="lg">
                  <ShoppingCart className="w-4 h-4" />
                  购买善意币
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Earn & Spend Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Earn Methods */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <ArrowDownRight className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">获取方式</h3>
            </div>
            <div className="space-y-4">
              {earnMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-xl p-4 border border-border/50 hover:border-primary/30 transition-colors flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-kindflow-teal-light flex items-center justify-center shrink-0">
                    <method.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{method.title}</h4>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                  <span className="text-primary font-semibold whitespace-nowrap">{method.amount}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Spend Methods */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-kindflow-coral/10 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-kindflow-coral" />
              </div>
              <h3 className="text-xl font-semibold">消耗方式</h3>
            </div>
            <div className="space-y-4">
              {spendMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-xl p-4 border border-border/50 hover:border-kindflow-coral/30 transition-colors flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-kindflow-coral-light flex items-center justify-center shrink-0">
                    <method.icon className="w-6 h-6 text-kindflow-coral" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{method.title}</h4>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                  <span className="text-kindflow-coral font-semibold whitespace-nowrap">{method.amount}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground bg-muted/50 inline-block px-6 py-3 rounded-full">
            💡 善意币不可提现，仅用于平台内激励与治理，聚焦真正的善行价值
          </p>
        </motion.div>
      </div>
    </section>
  );
};
