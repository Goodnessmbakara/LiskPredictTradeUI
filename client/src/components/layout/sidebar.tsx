import {
  Brain,
  ChartLine,
  Bot,
  History,
  Wallet,
  Newspaper,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
    </aside>
  );
}
