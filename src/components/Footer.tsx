import { Heart, Github, Twitter, MessageCircle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-gradient-hero">KindFlow</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              让善意流动起来。通过区块链技术记录每一次善行，用善意币激励互助行为，构建可持续的公益互助生态系统。
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">平台功能</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#tasks" className="hover:text-foreground transition-colors">互助任务</a></li>
              <li><a href="#events" className="hover:text-foreground transition-colors">事件追踪</a></li>
              <li><a href="#token" className="hover:text-foreground transition-colors">善意币</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">排行榜</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">关于我们</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">白皮书</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">团队介绍</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">用户协议</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">隐私政策</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 KindFlow. 让每一份善意都被看见
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Built with <Heart className="w-4 h-4 text-kindflow-coral" /> on Monad Testnet
          </p>
        </div>
      </div>
    </footer>
  );
};
