import { Brain, ChartLine, Bot, History, Wallet, Newspaper, Settings, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";

const navigation = [
  { name: "Dashboard", icon: ChartLine, href: "/", current: true },
  { name: "AI Predictions", icon: Bot, href: "/predictions", current: false },
  { name: "Auto Trading", icon: Brain, href: "/trading", current: false },
  { name: "Trade History", icon: History, href: "/history", current: false },
  { name: "Portfolio", icon: Wallet, href: "/portfolio", current: false },
  { name: "Sentiment", icon: Newspaper, href: "/sentiment", current: false },
  { name: "Settings", icon: Settings, href: "/settings", current: false },
];

export function Sidebar() {
  const { isConnected, address, balance, connect, disconnect } = useWallet();

  return (
    <aside className="w-64 bg-secondary border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">AI TradeBot</h1>
            <p className="text-xs text-muted-foreground">Lisk Network</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Button
                  variant={item.current ? "secondary" : "ghost"}
                  className={`w-full justify-start ${
                    item.current 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  size="sm"
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Wallet Connection */}
      <div className="p-4 border-t border-border">
        {isConnected ? (
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-chart-1 rounded-full flex items-center justify-center">
                <Check className="h-4 w-4 text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{address}</p>
                <p className="text-xs text-muted-foreground">Connected</p>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Balance:</span>
              <span className="font-medium text-foreground">{balance} ETH</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2"
              onClick={disconnect}
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <Button 
            className="w-full" 
            onClick={connect}
          >
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        )}
      </div>
    </aside>
  );
}
