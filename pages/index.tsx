import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Connection, PublicKey, clusterApiUrl, Keypair } from '@solana/web3.js';
import { WalletProps } from '@/app/interfaces/main';

interface WalletScreenProps {
  wallet: WalletProps,
  handleSetWallet: (wallet: WalletProps) => void,
  balance: number,
  handleSetBalance: (count: number) => void
}

function Wallet({ wallet, handleSetWallet, handleSetBalance, balance }: WalletScreenProps) {
  const createWallet = useCallback(async () => {

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const newWallet = Keypair.generate();
    const publicKey = newWallet.publicKey.toString();
    const privateKey = JSON.stringify(Array.from(newWallet.secretKey));

    const balance = await connection.getBalance(newWallet.publicKey);

    const walletData = { publicKey, privateKey };

    handleSetWallet({ publicKey, privateKey })

    handleSetBalance(balance / 1e9); // Convert from lamports to SOL

    localStorage.setItem('wallet', JSON.stringify(walletData));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <header className="flex justify-between w-full max-w-md p-4 bg-white shadow-md">
        <div className='flex-col flex'>
          <button onClick={createWallet} className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600">
            Создать кошелёк
          </button>
          <Link href="/transaction" className='className="px-4 py-2 font-semibold text-white bg-green-500 rounded hover:bg-green-600 mt-3 d-block text-center'>
            Транзакции
          </Link>
        </div>
        <div className="text-lg font-semibold text-black">Баланс: {balance} SOL</div>
      </header>
      {wallet && (
        <div className="flex flex-col items-center w-full max-w-md p-4 mt-4 bg-white shadow-md">
          <div className="mb-2 text-lg font-semibold text-black">Адрес кошелька:</div>
          <div className="p-2 mb-4 text-gray-700 bg-gray-200 rounded break-words w-full">{wallet.publicKey}</div>
          <div className="mb-2 text-lg font-semibold text-black">Приватный ключ:</div>
          <div className="p-2 text-gray-700 bg-gray-200 rounded break-words w-full">{wallet.privateKey}</div>
        </div>
      )}
    </div>
  );
};

export default Wallet;