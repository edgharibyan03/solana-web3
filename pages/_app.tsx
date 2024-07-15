import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
import { AppProps } from 'next/app';
import { AccountInfo, clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
import "react-toastify/dist/ReactToastify.css";
import '../app/globals.css';

interface CustomAppProps extends AppProps { }

function MyApp({ Component, pageProps }: CustomAppProps) {
  const router = useRouter();

  const prevBalanceRef = useRef<number>(0);

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

    const newBalance = balance / 1e9

    handleSetBalance(newBalance);

    prevBalanceRef.current = newBalance; // Set initial balance
  }, []);

  const subscribeToBalanceChanges = useCallback((publicKey: string) => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const publicKeyObject = new PublicKey(publicKey);

    connection.onAccountChange(publicKeyObject, (accountInfo: AccountInfo<Buffer>) => {
      const newBalance = accountInfo.lamports / 1e9;
      const balanceChange = newBalance - prevBalanceRef.current;
      setBalance(newBalance);
      prevBalanceRef.current = newBalance;

      if (balanceChange > 0) {
        toast.success(`Баланс кошелка изменён: добавлено ${balanceChange} SOL`);
      } else {
        toast.warn(`Баланс кошелка изменён: выведено ${Math.abs(balanceChange)} SOL`);
      }
    });
  }, []);

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
      subscribeToBalanceChanges(parsedWallet.publicKey);
    }
  }, []);

  return (
    <div>
      <Component
        {...pageProps}
        wallet={wallet}
        balance={balance}
        prevBalanceRef={prevBalanceRef}
        handleSetBalance={handleSetBalance}
        handleSetWallet={handleSetWallet}
      />
      <ToastContainer
        autoClose={3000}
      />
    </div>
  );
}

export default MyApp;