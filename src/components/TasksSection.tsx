import { motion } from 'framer-motion';
import { Plus, Filter, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskCard } from './TaskCard';
import { useAccount } from 'wagmi';

const mockTasks = [
  {
    id: '1',
    title: '帮忙接送小孩放学',
    description: '因工作原因无法按时接孩子，需要志愿者帮忙从学校接送到家，距离约2公里',
    reward: 50,
    location: '北京市海淀区',
    timePosted: '2小时前',
    author: '0x1234...5678',
    status: 'open' as const,
    category: '生活帮助',
  },
  {
    id: '2',
    title: '急需O型血献血志愿者',
    description: '家人手术急需O型血，希望有爱心人士能够帮助，所有费用由我承担',
    reward: 200,
    location: '上海市浦东新区',
    timePosted: '5小时前',
    author: '0xabcd...efgh',
    status: 'open' as const,
    category: '医疗援助',
  },
  {
    id: '3',
    title: '寻找走失宠物',
    description: '家中柯基犬于昨日下午走失，毛色黄白相间，若有发现请联系',
    reward: 100,
    location: '广州市天河区',
    timePosted: '1天前',
    author: '0x9876...5432',
    status: 'in-progress' as const,
    category: '寻物启事',
  },
  {
    id: '4',
    title: '社区老人陪伴志愿服务',
    description: '社区内有独居老人需要陪伴聊天，每周两次，每次约1小时',
    reward: 30,
    location: '深圳市南山区',
    timePosted: '3天前',
    author: '0xfedc...ba98',
    status: 'open' as const,
    category: '志愿服务',
  },
];

export const TasksSection = () => {
  const { isConnected } = useAccount();

  return (
    <section id="tasks" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <div className="flex items-center gap-2 text-primary mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">热门互助</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">善意互助任务</h2>
            <p className="text-muted-foreground mt-2">发布您需要帮助的任务，或帮助他人完成任务获得善意币</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
              筛选
            </Button>
            {isConnected && (
              <Button variant="hero" size="sm">
                <Plus className="w-4 h-4" />
                发布任务
              </Button>
            )}
          </div>
        </motion.div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <TaskCard {...task} />
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
            查看更多任务
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
