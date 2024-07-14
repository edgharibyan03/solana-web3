import { useState, ChangeEvent, useCallback } from 'react';
import { Connection, PublicKey, clusterApiUrl, Transaction, SystemProgram, Keypair, sendAndConfirmTransaction } from '@solana/web3.js';

interface TransactionScreenProps {
  wallet: Keypair | null;
}

const TransactionScreen: React.FC<TransactionScreenProps> = ({ wallet }) => {
  const [amount, setAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [balance, setBalance] = useState<number>(0);

  const sendTransaction = useCallback(async () => {
    console.log(wallet);

    if (!wallet) return;

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: new PublicKey(recipient),
        lamports: parseFloat(amount) * 1e9, // convert SOL to lamports
      })
    );

    // let keypair = Keypair.generate();

    // sendAndConfirmTransaction(connection, transaction, [keypair]);

    const signature = await connection.sendTransaction(transaction, [wallet]);
    await connection.confirmTransaction(signature);

    const updatedBalance = await connection.getBalance(wallet.publicKey);
    console.log(updatedBalance);

    setBalance(updatedBalance / 1e9); // convert lamports to SOL
  }, [amount, recipient, wallet]);

  const handleAmountChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  }, []);

  const handleRecipientChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setRecipient(e.target.value);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <header className="flex justify-between w-full max-w-md p-4 bg-white shadow-md">
        <button onClick={() => window.history.back()} className="px-4 py-2 font-semibold text-white bg-red-500 rounded hover:bg-red-600">
          Назад
        </button>
        <div className="text-lg font-semibold text-black">Баланс: {balance} SOL</div>
      </header>
      <div className="flex flex-col items-center w-full max-w-md p-4 mt-4 bg-white shadow-md">
        <input
          type="number"
          placeholder="Количество SOL"
          value={amount}
          onChange={handleAmountChange}
          className="w-full p-2 mb-4 text-gray-700 bg-gray-200 rounded text-black"
        />
        <input
          type="text"
          placeholder="Адрес кошелька получателя"
          value={recipient}
          onChange={handleRecipientChange}
          className="w-full p-2 mb-4 text-gray-700 bg-gray-200 rounded text-black"
        />
        <button onClick={sendTransaction} className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600">
          Отправить
        </button>
      </div>
    </div>
  );
};

export default TransactionScreen;