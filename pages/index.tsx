import { useCallback } from 'react';
import Link from 'next/link';
import { Connection, clusterApiUrl, Keypair } from '@solana/web3.js';
import { WalletProps } from '@/app/interfaces/main';
import { toast } from 'react-toastify';

interface WalletScreenProps {
  wallet: WalletProps,
  balance: number,
  prevBalanceRef: any,
  handleSetBalance: (count: number) => void
  handleSetWallet: (wallet: WalletProps) => void,
}

function Wallet({ wallet, handleSetWallet, handleSetBalance, balance, prevBalanceRef }: WalletScreenProps) {
  const createWallet = useCallback(async () => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const newWallet = Keypair.generate();
    const publicKey = newWallet.publicKey.toString();
    const privateKey = JSON.stringify(Array.from(newWallet.secretKey));

    const balance = await connection.getBalance(newWallet.publicKey);

    const walletData = { publicKey, privateKey };

    handleSetWallet({ publicKey, privateKey })

    handleSetBalance(balance / 1e9);

    prevBalanceRef.current = balance / 1e9; // Set initial balance

    localStorage.setItem('wallet', JSON.stringify(walletData));

    toast.success('Кошелек успешно создан')
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="container max-[600px]:w-11/12 flex flex-col items-center justify-center">
        <header className="flex justify-between w-full max-w-md p-4 bg-white shadow-md max-[600px]:flex-col-reverse">
          <div className='flex-col flex'>
            <button onClick={createWallet} className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600">
              Создать кошелёк
            </button>
            <Link href="/transaction" className='className="px-4 py-2 font-semibold text-white bg-green-500 rounded hover:bg-green-600 mt-3 d-block text-center'>
              Транзакции
            </Link>
          </div>
          <div className="text-lg font-semibold text-black max-[600px]:mb-5">Баланс: {balance} SOL</div>
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
    </div>
  );
};

export default Wallet;