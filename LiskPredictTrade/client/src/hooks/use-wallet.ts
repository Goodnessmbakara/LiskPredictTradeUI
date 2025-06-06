import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string;
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: "0.00",
  });
  const { toast } = useToast();

  useEffect(() => {
    // Initialize with mock connected state for demo
    setWallet({
      isConnected: true,
      address: "0x742d...4b5f",
      balance: "2.45",
    });
  }, []);

  const connect = async () => {
    try {
      // Mock wallet connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWallet({
        isConnected: true,
        address: "0x742d35cc6bf000000000000000004b5f",
        balance: "2.45",
      });
      
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to MetaMask",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const disconnect = () => {
    setWallet({
      isConnected: false,
      address: null,
      balance: "0.00",
    });
    
    toast({
      title: "Wallet Disconnected",
      description: "Wallet has been disconnected successfully",
    });
  };

  return {
    ...wallet,
    connect,
    disconnect,
  };
}
