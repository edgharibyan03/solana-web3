import { useState, ChangeEvent, useCallback } from 'react';
import { Connection, PublicKey, clusterApiUrl, Transaction, SystemProgram, Keypair, sendAndConfirmTransaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { WalletProps } from '@/app/interfaces/main';
import { toast } from 'react-toastify';

interface TransactionScreenProps {
  wallet: WalletProps,
  balance: number,
  handleSetBalance: (count: number) => void
}

const TransactionScreen: React.FC<TransactionScreenProps> = ({ wallet, handleSetBalance, balance }) => {
  const [amount, setAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  const sendTransaction = useCallback(async () => {

    setIsSending(true);

    try {
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

      const fromWallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(wallet.privateKey)));

      const toWallet = new PublicKey(recipient);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromWallet.publicKey,
          toPubkey: toWallet,
          lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
        })
      );

      await sendAndConfirmTransaction(connection, transaction, [fromWallet]);

      const newBalance = await connection.getBalance(fromWallet.publicKey);
      handleSetBalance(newBalance / LAMPORTS_PER_SOL);

      toast.success('Транзакция выполнена успешно')
    } catch (error) {
      console.error('Transaction failed:', error);

      toast.error('Транзакция не выполнена')
    } finally {
      setIsSending(false);
    }

  }, [wallet, recipient, amount]);

  const handleAmountChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  }, []);

  const handleRecipientChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setRecipient(e.target.value);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="container max-[600px]:w-11/12 flex flex-col items-center justify-center">
        <header className="flex justify-between w-full max-w-md p-4 bg-white shadow-md items-center">
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
          <button onClick={sendTransaction} disabled={isSending} className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600">
            {isSending ? 'Отправка...' : 'Отправить'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionScreen;