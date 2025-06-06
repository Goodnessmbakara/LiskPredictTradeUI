import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  TrendingUp, 
  Zap, 
  Shield, 
  Brain, 
  Wallet, 
  DollarSign, 
  Bot,
  Github,
  Twitter,
  MessageCircle,
  ChevronRight,
  CheckCircle,
  Eye,
  Clock,
  Lock
} from "lucide-react";
import { SiReact, SiFastapi, SiPytorch, SiSolidity } from "react-icons/si";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">TradingAI</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-foreground hover:text-primary transition-colors">Home</a>
            <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
            <a href="#features" className="text-foreground hover:text-primary transition-colors">Features</a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
          </nav>

          <Link href="/dashboard">
            <Button className="bg-primary hover:bg-primary/90">
              Get Started
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-6 text-sm">
            <Zap className="mr-2 h-4 w-4" />
            Powered by Advanced AI
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI-Powered Token Prediction
            </span>
            <br />
            for Smarter Web3 Trading
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Grow your crypto passively. Our AI analyzes token data and executes trades automatically — so you don't have to.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-4">
                Get Started Now
                <TrendingUp className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              Watch Demo
              <Eye className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">98.5%</div>
              <div className="text-muted-foreground">Prediction Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">$2.4M+</div>
              <div className="text-muted-foreground">Assets Under Management</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-muted-foreground">Active Traders</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start trading smarter in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <Wallet className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-4">Connect Wallet</h3>
                <p className="text-muted-foreground">
                  Securely connect your Web3 wallet using industry-standard protocols. Your funds remain under your control.
                </p>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-4">Fund Your Account</h3>
                <p className="text-muted-foreground">
                  Deposit your preferred crypto assets. Set your risk tolerance and investment parameters.
                </p>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-4">Let AI Trade For You</h3>
                <p className="text-muted-foreground">
                  Our advanced AI monitors markets 24/7, executing optimal trades based on real-time analysis.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced technology meets intuitive design for optimal trading performance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 group border-2 hover:border-primary/50">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Prediction Accuracy</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced ML models with 98.5% accuracy in market predictions
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-all duration-300 group border-2 hover:border-primary/50">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Real-Time Execution</h3>
                <p className="text-sm text-muted-foreground">
                  Lightning-fast trade execution with minimal slippage
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-all duration-300 group border-2 hover:border-primary/50">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">On-Chain + Off-Chain Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive analysis combining blockchain and market data
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-all duration-300 group border-2 hover:border-primary/50">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Fully Decentralized</h3>
                <p className="text-sm text-muted-foreground">
                  Non-custodial architecture ensures your assets stay secure
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built with Cutting-Edge Technology</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powered by the most advanced frameworks and tools in the industry
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 bg-background rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <SiReact className="h-8 w-8 text-[#61DAFB]" />
              </div>
              <span className="text-sm font-medium">React</span>
            </div>
            
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 bg-background rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <SiFastapi className="h-8 w-8 text-[#009688]" />
              </div>
              <span className="text-sm font-medium">FastAPI</span>
            </div>
            
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 bg-background rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <SiPytorch className="h-8 w-8 text-[#EE4C2C]" />
              </div>
              <span className="text-sm font-medium">PyTorch</span>
            </div>
            
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 bg-background rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <div className="h-8 w-8 bg-[#FF6B35] rounded flex items-center justify-center text-white font-bold text-xs">
                  L
                </div>
              </div>
              <span className="text-sm font-medium">Lisk</span>
            </div>
            
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 bg-background rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <SiSolidity className="h-8 w-8 text-[#363636]" />
              </div>
              <span className="text-sm font-medium">Solidity</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Smart Trading?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of traders who are already using AI to maximize their crypto profits
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-4">
                    Start Trading Now
                    <TrendingUp className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  Learn More
                  <CheckCircle className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-secondary/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Brain className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">TradingAI</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                The future of crypto trading is here. Let our AI handle the complexity while you enjoy the profits.
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm" className="p-2">
                  <Github className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="p-2">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="p-2">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 TradingAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}