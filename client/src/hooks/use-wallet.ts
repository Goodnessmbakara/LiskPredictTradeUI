import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string;
  provider: ethers.BrowserProvider | null;
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: "0.00",
    provider: null,
  });
  const { toast } = useToast();

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            const balance = await provider.getBalance(accounts[0]);
            setWallet({
              isConnected: true,
              address: accounts[0].address,
              balance: ethers.formatEther(balance),
              provider,
            });
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          checkConnection();
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, []);

  const connect = async () => {
    try {
      const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions: {},
      });

      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        const balance = await provider.getBalance(accounts[0]);
        setWallet({
          isConnected: true,
          address: accounts[0].address,
          balance: ethers.formatEther(balance),
          provider,
        });
        
        toast({
          title: "Wallet Connected",
          description: "Successfully connected to your wallet",
        });
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const disconnect = async () => {
    try {
      const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions: {},
      });
      
      await web3Modal.clearCachedProvider();
      
      setWallet({
        isConnected: false,
        address: null,
        balance: "0.00",
        provider: null,
      });
      
      toast({
        title: "Wallet Disconnected",
        description: "Wallet has been disconnected successfully",
      });
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast({
        title: "Disconnection Failed",
        description: "Failed to disconnect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    ...wallet,
    connect,
    disconnect,
  };
}
