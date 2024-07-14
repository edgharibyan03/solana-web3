import { useCallback, useState } from 'react';
import { Connection, PublicKey, clusterApiUrl, Keypair } from '@solana/web3.js';
import Link from 'next/link';

interface WalletScreenProps {
  wallet: Keypair,
  handleSetWallet: (wallet: Keypair) => void
}

function Wallet({ wallet, handleSetWallet }: WalletScreenProps) {
  const [balance, setBalance] = useState<number>(0);

  const createWallet = useCallback(async () => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const newWallet = Keypair.generate();

    handleSetWallet(newWallet)

    const publicKey = new PublicKey(newWallet.publicKey).toString();
    const balance = await connection.getBalance(new PublicKey(newWallet.publicKey));
    setBalance(balance / 1e9); // convert lamports to SOL
  }, []);

  console.log(handleSetWallet);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <header className="flex justify-between w-full max-w-md p-4 bg-white shadow-md">
        <button onClick={createWallet} className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600">
          Создать кошелёк
        </button>
        <Link href="/transaction" className='className="px-4 py-2 font-semibold text-white bg-green-500 rounded hover:bg-green-600"'>
          Транзакции
        </Link>
        <div className="text-lg font-semibold text-black">Баланс: {balance} SOL</div>
      </header>
      {wallet && (
        <div className="flex flex-col items-center w-full max-w-md p-4 mt-4 bg-white shadow-md">
          <div className="mb-2 text-lg font-semibold">Адрес кошелька:</div>
          <div className="p-2 mb-4 text-gray-700 bg-gray-200 rounded break-words w-full">{wallet.publicKey.toString()}</div>
          <div className="mb-2 text-lg font-semibold">Приватный ключ:</div>
          <div className="p-2 text-gray-700 bg-gray-200 rounded break-words w-full">{wallet.secretKey.toString()}</div>
        </div>
      )}
    </div>
  );
};

export default Wallet;