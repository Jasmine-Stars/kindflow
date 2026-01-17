import { motion } from 'framer-motion';
import { Heart, MapPin, Clock, Coins, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  reward: number;
  location: string;
  timePosted: string;
  author: string;
  status: 'open' | 'in-progress' | 'completed';
  category: string;
}

export const TaskCard = ({ 
  title, 
  description, 
  reward, 
  location, 
  timePosted, 
  author,
  status,
  category 
}: TaskCardProps) => {
  const statusColors = {
    'open': 'bg-primary/10 text-primary border-primary/20',
    'in-progress': 'bg-kindflow-gold/10 text-kindflow-gold border-kindflow-gold/20',
    'completed': 'bg-muted text-muted-foreground border-border',
  };

  const statusText = {
    'open': '待接取',
    'in-progress': '进行中',
    'completed': '已完成',
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="bg-card rounded-2xl p-6 shadow-card border border-border/50 hover:border-primary/30 hover:shadow-glow transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-kindflow-teal-light text-primary text-xs font-medium">
            {category}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[status]}`}>
            {statusText[status]}
          </span>
        </div>
        <div className="flex items-center gap-1 text-kindflow-gold font-semibold">
          <Coins className="w-4 h-4" />
          <span>{reward} KC</span>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{description}</p>

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{timePosted}</span>
        </div>
        <div className="flex items-center gap-1">
          <User className="w-4 h-4" />
          <span>{author}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="hero" size="sm" className="flex-1">
          接取任务
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm">
          <Heart className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};
