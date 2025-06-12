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

// Create a single Web3Modal instance
const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions: {},
  disableInjectedProvider: false,
});

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: "0.00",
    provider: null,
  });
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    // Check if wallet is already connected
    const checkConnection = async () => {
      try {
        // First check if there's a cached provider
        if (web3Modal.cachedProvider) {
          const provider = new ethers.BrowserProvider(web3Modal.cachedProvider);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0 && mounted) {
            const balance = await provider.getBalance(accounts[0]);
            setWallet({
              isConnected: true,
              address: accounts[0].address,
              balance: ethers.formatEther(balance),
              provider,
            });
            return;
          }
        }

        // If no cached provider or no accounts, check window.ethereum
        if (typeof window.ethereum !== "undefined") {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0 && mounted) {
            const balance = await provider.getBalance(accounts[0]);
            setWallet({
              isConnected: true,
              address: accounts[0].address,
              balance: ethers.formatEther(balance),
              provider,
            });
          }
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
        if (mounted) {
          // Only clear cache if there's an actual error
          if (error instanceof Error && !error.message.includes("User rejected")) {
            web3Modal.clearCachedProvider();
            setWallet({
              isConnected: false,
              address: null,
              balance: "0.00",
              provider: null,
            });
          }
        }
      }
    };

    // Initial connection check
    checkConnection();

    // Set up event listeners
    const setupEventListeners = () => {
      if (window.ethereum) {
        const handleAccountsChanged = (accounts: string[]) => {
          if (accounts.length === 0) {
            disconnect();
          } else {
            checkConnection();
          }
        };

        const handleChainChanged = () => {
          window.location.reload();
        };

        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);

        return () => {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
          window.ethereum.removeListener("chainChanged", handleChainChanged);
        };
      }
    };

    const cleanup = setupEventListeners();

    return () => {
      mounted = false;
      if (cleanup) cleanup();
    };
  }, []);

  const connect = async () => {
    try {
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
      // Only show error toast if it's not a user rejection
      if (!(error instanceof Error && error.message.includes("User rejected"))) {
        toast({
          title: "Connection Failed",
          description: "Failed to connect wallet. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const disconnect = async () => {
    try {
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
