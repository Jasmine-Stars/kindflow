import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ChevronDown, LogOut, Copy, Check, Menu, X, Heart, AlertTriangle, Home, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';


const navItems = [
  { name: '首页', href: '#home', icon: Home },
  { name: '互助任务', href: '#tasks', icon: Heart },
  { name: '事件追踪', href: '#events', icon: AlertTriangle },
  { name: '善意币', href: '#token', icon: Coins },
];

export const Header = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConnect = () => {
    const injectedConnector = connectors.find(c => c.id === 'injected');
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-gradient-hero">KindFlow</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </a>
            ))}
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center gap-3">
            {isConnected ? (
              <div className="relative">
                <Button
                  variant="wallet"
                  onClick={() => setIsWalletDropdownOpen(!isWalletDropdownOpen)}
                  className="flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="hidden sm:inline">{shortenAddress(address!)}</span>
                  <span className="sm:hidden">已连接</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isWalletDropdownOpen ? 'rotate-180' : ''}`} />
                </Button>

                <AnimatePresence>
                  {isWalletDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-card rounded-xl shadow-card border border-border p-4"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">钱包地址</span>
                          <button 
                            onClick={copyAddress}
                            className="text-primary hover:text-primary/80 transition-colors"
                          >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-sm font-mono bg-secondary rounded-lg px-3 py-2 break-all">
                          {address}
                        </p>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <span className="text-sm text-muted-foreground">网络</span>
                          <span className="font-semibold text-sm">
                            Monad Testnet
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">善意币</span>
                          <span className="font-semibold text-kindflow-gold">1,250 KC</span>
                        </div>

                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            disconnect();
                            setIsWalletDropdownOpen(false);
                          }}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          断开连接
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Button
                variant="hero"
                onClick={handleConnect}
                disabled={isPending}
              >
                <Wallet className="w-4 h-4" />
                {isPending ? '连接中...' : '连接钱包'}
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4"
            >
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
