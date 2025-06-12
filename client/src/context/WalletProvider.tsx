import React, { createContext, useContext } from "react";
import { useWallet as useWalletHook } from "@/hooks/use-wallet";

const WalletContext = createContext<ReturnType<typeof useWalletHook> | null>(
  null
);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const wallet = useWalletHook();
  return (
    <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>
  );
};

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within a WalletProvider");
  return ctx;
}
