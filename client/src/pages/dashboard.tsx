import { Sidebar } from "@/components/layout/sidebar";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { PredictionPanel } from "@/components/dashboard/prediction-panel";
import { TradeHistory } from "@/components/dashboard/trade-history";
import { FundManagement } from "@/components/dashboard/fund-management";
import { SentimentAnalysis } from "@/components/dashboard/sentiment-analysis";
import { PriceChart } from "@/components/dashboard/price-chart";
import { Bell, User, LogOut, Check, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/WalletProvider";
import { Link } from "wouter";

export default function Dashboard() {
  const { address, balance, disconnect } = useWallet();

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-secondary border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  AI-Powered Trading Dashboard
                </h2>
                <p className="text-sm text-muted-foreground">
                  Real-time predictions and automated trading on Lisk Network
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <div className="bg-muted rounded-lg p-2 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-chart-1 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-black" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {address || "No address"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {balance || "0.00"} ETH
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisconnect}
                  className="flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></span>
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Stats Cards */}
          <StatsCards />

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Charts Section */}
            <div className="lg:col-span-2 space-y-6">
              <PriceChart />
              <TradeHistory />
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              <PredictionPanel />
              <FundManagement />
            </div>
          </div>

          {/* Bottom Section */}
          <SentimentAnalysis />
        </div>
      </main>
    </div>
  );
}
