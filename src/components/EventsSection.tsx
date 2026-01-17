import { motion } from 'framer-motion';
import { Plus, Filter, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventCard } from './EventCard';
import { useAccount } from 'wagmi';

const mockEvents = [
  {
    id: '1',
    title: '某电商平台虚假宣传事件',
    description: '某知名电商平台被曝存在虚假宣传行为，多名消费者反映购买商品与描述严重不符',
    location: '全国',
    date: '2024-01-15',
    status: 'tracking' as const,
    watchCount: 1234,
    category: '消费欺诈',
    severity: 'high' as const,
  },
  {
    id: '2',
    title: '社区物业乱收费问题',
    description: '小区物业在未经业主同意的情况下擅自提高物业费，并威胁不缴费就停水停电',
    location: '成都市武侯区',
    date: '2024-01-10',
    status: 'tracking' as const,
    watchCount: 567,
    category: '物业纠纷',
    severity: 'medium' as const,
  },
  {
    id: '3',
    title: '网络诈骗团伙曝光',
    description: '一犯罪团伙冒充公安机关实施电信诈骗，已有多人受骗，涉案金额巨大',
    location: '线上',
    date: '2024-01-08',
    status: 'resolved' as const,
    watchCount: 2891,
    category: '电信诈骗',
    severity: 'high' as const,
  },
  {
    id: '4',
    title: '食品安全隐患举报',
    description: '某连锁餐厅被曝使用过期食材，市场监管部门已介入调查',
    location: '杭州市西湖区',
    date: '2024-01-05',
    status: 'resolved' as const,
    watchCount: 892,
    category: '食品安全',
    severity: 'high' as const,
  },
];

export const EventsSection = () => {
  const { isConnected } = useAccount();

  return (
    <section id="events" className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <div className="flex items-center gap-2 text-kindflow-coral mb-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">公共监督</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">恶性事件追踪</h2>
            <p className="text-muted-foreground mt-2">关注恶性事件也是一种善行，用集体的力量推动问题解决</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
              筛选
            </Button>
            {isConnected && (
              <Button variant="accent" size="sm">
                <AlertTriangle className="w-4 h-4" />
                发布事件
              </Button>
            )}
          </div>
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <EventCard {...event} />
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <Button variant="outline" size="lg">
            查看更多事件
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
