# Веб-приложение для кошелька и транзакций Solana

Этот проект представляет собой веб-приложение, созданное с использованием Next.js и Solana Web3.js для создания криптовалютного кошелька и выполнения транзакций в сети Devnet Solana. Приложение адаптировано для мобильных устройств и включает следующие функции:
- Создание кошелька
- Отображение баланса кошелька, публичного и приватного ключей
- Отправка SOL на другой кошелёк
- Обновление баланса в реальном времени с оповещениями о изменениях

## Необходимые условия

Перед началом убедитесь, что у вас установлены следующие инструменты:
- Node.js (>= 14.x)
- npm (>= 6.x)

## Начало работы

### Клонирование репозитория

```bash
git clone https://github.com/edgharibyan03/solana-web3.git
cd solana-web3
```

### Установка зависимостей

```bash
npm install
```

### Билд приложения

```bash
npm run build
```

### Запуск приложения локально

```bash
npm run start
```

Откройте браузер и перейдите по адресу http://localhost:3000.

### Пополнение кошелька через CLI

### Установка Solana CLI

Обратитесь к официальной документации Solana(https://solana.com/developers/guides/getstarted/setup-local-development) для установки Solana CLI.

### Пополнения кошелька
```bash
solana airdrop 10 <WALLET_ADDRESS> --url https://api.devnet.solana.com
```
### Подтверждение транзакции
```bash
solana confirm <TRANSACTION_SIGNATURE> --url https://api.devnet.solana.com
```
