import { AppProps } from 'next/app';
import React, { useCallback, useState } from 'react';
import { Keypair } from '@solana/web3.js';
import '../app/globals.css';

interface CustomAppProps extends AppProps {
  wallet: Keypair | null;
  setWallet: (wallet: Keypair | null) => void;
}

function MyApp({ Component, pageProps }: CustomAppProps) {
  const [wallet, setWallet] = useState<Keypair | null>(null);

  const handleSetWallet = useCallback((wallet: Keypair) => {
    setWallet(wallet)
  }, [])

  return (
    <div>
      <Component {...pageProps} wallet={wallet} handleSetWallet={handleSetWallet} />
    </div>
  );
}

export default MyApp;