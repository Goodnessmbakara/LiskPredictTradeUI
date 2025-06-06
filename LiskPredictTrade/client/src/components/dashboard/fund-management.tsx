import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function FundManagement() {
  const [depositAmount, setDepositAmount] = useState("");
  const [depositToken, setDepositToken] = useState("ETH");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawToken, setWithdrawToken] = useState("ETH");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const { toast } = useToast();

  const depositMutation = useMutation({
    mutationFn: async ({ amount, token }: { amount: string; token: string }) => {
      const response = await apiRequest("POST", "/api/deposit", {
        amount,
        token,
        userId: 1,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Deposit Successful",
        description: data.message,
      });
      setDepositAmount("");
    },
    onError: () => {
      toast({
        title: "Deposit Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: async ({ amount, token, address }: { amount: string; token: string; address: string }) => {
      const response = await apiRequest("POST", "/api/withdraw", {
        amount,
        token,
        address,
        userId: 1,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Withdrawal Successful",
        description: data.message,
      });
      setWithdrawAmount("");
      setWithdrawAddress("");
    },
    onError: () => {
      toast({
        title: "Withdrawal Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount.",
        variant: "destructive",
      });
      return;
    }
    depositMutation.mutate({ amount: depositAmount, token: depositToken });
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount.",
        variant: "destructive",
      });
      return;
    }
    if (!withdrawAddress) {
      toast({
        title: "Missing Address",
        description: "Please enter a destination address.",
        variant: "destructive",
      });
      return;
    }
    withdrawMutation.mutate({ amount: withdrawAmount, token: withdrawToken, address: withdrawAddress });
  };

  return (
    <Card className="trading-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Fund Management</CardTitle>
        <p className="text-sm text-muted-foreground">Deposit and withdraw funds</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Portfolio Overview */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-primary text-sm font-medium">Available Balance</span>
            <ArrowDown className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">$18,429.67</p>
          <p className="text-primary/80 text-sm mt-1">Vault Address: 0x8f4...a2c9</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-muted-foreground text-sm">Locked in Trades</p>
            <p className="text-lg font-semibold text-foreground">$6,144.15</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-muted-foreground text-sm">Available</p>
            <p className="text-lg font-semibold text-foreground">$12,285.52</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-chart-1 hover:bg-chart-1/80 text-black">
                <ArrowDown className="mr-2 h-4 w-4" />
                Deposit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Deposit Funds</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="deposit-token">Select Token</Label>
                  <Select value={depositToken} onValueChange={setDepositToken}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETH">ETH - Ethereum</SelectItem>
                      <SelectItem value="LSK">LSK - Lisk</SelectItem>
                      <SelectItem value="USDC">USDC - USD Coin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="deposit-amount">Amount</Label>
                  <Input
                    id="deposit-amount"
                    type="number"
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleDeposit} 
                  className="w-full"
                  disabled={depositMutation.isPending}
                >
                  {depositMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Deposit"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <ArrowUp className="mr-2 h-4 w-4" />
                Withdraw
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Withdraw Funds</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="withdraw-token">Select Token</Label>
                  <Select value={withdrawToken} onValueChange={setWithdrawToken}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETH">ETH - Ethereum (Available: 2.47)</SelectItem>
                      <SelectItem value="LSK">LSK - Lisk (Available: 1,247)</SelectItem>
                      <SelectItem value="USDC">USDC - USD Coin (Available: 5,420)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="withdraw-amount">Amount</Label>
                  <Input
                    id="withdraw-amount"
                    type="number"
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="withdraw-address">Destination Address</Label>
                  <Input
                    id="withdraw-address"
                    placeholder="0x..."
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleWithdraw} 
                  className="w-full"
                  disabled={withdrawMutation.isPending}
                >
                  {withdrawMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Withdrawal"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Trading Settings */}
        <div className="space-y-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Auto-Trading</span>
            <div className="flex items-center space-x-2">
              <span className="text-chart-1 text-sm font-medium">Active</span>
              <div className="w-10 h-6 bg-chart-1 rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Risk Level</span>
            <span className="bg-chart-3/10 text-chart-3 px-2 py-1 rounded-full text-xs font-medium">Medium</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Max Trade Size</span>
            <span className="text-foreground font-medium text-sm">5% of balance</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
