"use client";

import {
  createClientUPProvider,
  type UPClientProvider,
} from "@lukso/up-provider";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { createWalletClient, custom } from "viem";
import { lukso, luksoTestnet } from "viem/chains";

interface UpContextInterface {
  provider: UPClientProvider | null;
  client: ReturnType<typeof createWalletClient> | null;
  chainId: number;
  accounts: Array<`0x${string}`>;
  contextAccounts: Array<`0x${string}`>;
  walletConnected: boolean;
}

interface UpProviderProps {
  children: ReactNode;
}

export const UpContext = createContext<UpContextInterface | undefined>(
  undefined
);

const provider =
  typeof window !== "undefined" ? createClientUPProvider() : null;

export function UpProvider({ children }: UpProviderProps) {
  const [chainId, setChainId] = useState<number>(0);
  const [accounts, setAccounts] = useState<Array<`0x${string}`>>([]);
  const [contextAccounts, setContextAccounts] = useState<Array<`0x${string}`>>(
    []
  );
  const [walletConnected, setWalletConnected] = useState(false);
  const [account] = accounts ?? [];
  const [contextAccount] = contextAccounts ?? [];

  const client = useMemo(() => {
    if (provider && chainId) {
      return createWalletClient({
        chain:
          chainId === 42 || String(chainId) === "0x2a" ? lukso : luksoTestnet,
        transport: custom(provider),
      });
    }
    return null;
  }, [chainId]);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        if (!client || !provider) {
          return;
        }

        const _accounts = (await provider.request(
          "eth_accounts",
          []
        )) as Array<`0x${string}`>;
        if (!mounted) {
          return;
        }
        setAccounts(_accounts);

        const _chainId = (await provider.request("eth_chainId")) as number;
        if (!mounted) {
          return;
        }
        setChainId(_chainId);

        const _contextAccounts = provider.contextAccounts;
        if (!mounted) {
          return;
        }
        setContextAccounts(_contextAccounts);
        setWalletConnected(_accounts[0] != null && _contextAccounts[0] != null);
      } catch (error) {
        console.error(error);
      }
    }

    init();

    if (provider) {
      const accountsChanged = (_accounts: Array<`0x${string}`>) => {
        setAccounts(_accounts);
        setWalletConnected(_accounts[0] != null && contextAccount != null);
      };

      const contextAccountsChanged = (_accounts: Array<`0x${string}`>) => {
        setContextAccounts(_accounts);
        setWalletConnected(account != null && _accounts[0] != null);
      };

      const chainChanged = (_chainId: number) => {
        setChainId(_chainId);
      };

      provider.on("accountsChanged", accountsChanged);
      provider.on("chainChanged", chainChanged);
      provider.on("contextAccountsChanged", contextAccountsChanged);

      return () => {
        mounted = false;
        provider.removeListener("accountsChanged", accountsChanged);
        provider.removeListener(
          "contextAccountsChanged",
          contextAccountsChanged
        );
        provider.removeListener("chainChanged", chainChanged);
      };
    }

    // If you want to be responsive to account changes
    // you also need to look at the first account rather
    // then the length or the whole array. Unfortunately react doesn't properly
    // look at array values like vue or knockout
  }, [client, account, contextAccount]);

  const data = useMemo(() => {
    return {
      provider,
      client,
      chainId,
      accounts,
      contextAccounts,
      walletConnected,
    };
  }, [client, chainId, accounts, contextAccounts, walletConnected]);

  return <UpContext.Provider value={data}>{children}</UpContext.Provider>;
}
