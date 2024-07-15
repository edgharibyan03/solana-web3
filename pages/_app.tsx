import { AppProps } from 'next/app';
import React, { useCallback, useEffect, useState } from 'react';
import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
import '../app/globals.css';
import { WalletProps } from '@/app/interfaces/main';
import { useRouter } from 'next/router';

interface CustomAppProps extends AppProps { }

function MyApp({ Component, pageProps }: CustomAppProps) {
  const router = useRouter();

  const [wallet, setWallet] = useState<Keypair | null>(null);
  const [balance, setBalance] = useState<number>(0);

  const handleSetWallet = useCallback((wallet: Keypair) => {
    setWallet(wallet)
  }, [])

  const handleSetBalance = useCallback((balance: number) => {
    setBalance(balance)
  }, [])

  const fetchBalance = useCallback(async (publicKey: string) => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const balance = await connection.getBalance(new PublicKey(publicKey));
    handleSetBalance(balance / 1e9); // Convert from lamports to SOL
  }, []);
  console.log(wallet);

  useEffect(() => {
    const savedWallet = localStorage.getItem('wallet');
    if (savedWallet) {
      setWallet(JSON.parse(savedWallet));
    } else {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    const savedWallet = localStorage.getItem('wallet');
    if (savedWallet) {
      const parsedWallet = JSON.parse(savedWallet);
      handleSetWallet(parsedWallet);
      fetchBalance(parsedWallet.publicKey);
    }
  }, []);

  return (
    <div>
      <Component
        {...pageProps}
        wallet={wallet}
        balance={balance}
        handleSetBalance={handleSetBalance}
        handleSetWallet={handleSetWallet}
      />
    </div>
  );
}

export default MyApp;