import { motion } from 'framer-motion';
import { AlertTriangle, MapPin, Calendar, Eye, Users, ExternalLink, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  status: 'tracking' | 'resolved' | 'failed';
  watchCount: number;
  category: string;
  severity: 'low' | 'medium' | 'high';
}

export const EventCard = ({
  title,
  description,
  location,
  date,
  status,
  watchCount,
  category,
  severity,
}: EventCardProps) => {
  const statusConfig = {
    'tracking': { 
      color: 'bg-kindflow-gold/10 text-kindflow-gold border-kindflow-gold/20', 
      text: '追踪中',
      icon: Clock 
    },
    'resolved': { 
      color: 'bg-primary/10 text-primary border-primary/20', 
      text: '已解决',
      icon: CheckCircle 
    },
    'failed': { 
      color: 'bg-destructive/10 text-destructive border-destructive/20', 
      text: '未解决',
      icon: AlertTriangle 
    },
  };

  const severityColors = {
    'low': 'bg-muted text-muted-foreground',
    'medium': 'bg-kindflow-gold/10 text-kindflow-gold',
    'high': 'bg-destructive/10 text-destructive',
  };

  const StatusIcon = statusConfig[status].icon;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="bg-card rounded-2xl p-6 shadow-card border border-border/50 hover:border-destructive/30 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${severityColors[severity]}`}>
            {category}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${statusConfig[status].color}`}>
            <StatusIcon className="w-3 h-3" />
            {statusConfig[status].text}
          </span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <Eye className="w-4 h-4" />
          <span>{watchCount}</span>
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
          <Calendar className="w-4 h-4" />
          <span>{date}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="accent" size="sm" className="flex-1">
          <Eye className="w-4 h-4" />
          关注事件
          <span className="text-xs opacity-80">(5 KC)</span>
        </Button>
        <Button variant="outline" size="sm">
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};
