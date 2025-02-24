"use client";
import { useStockWebSocket } from "@/api/useStockWebSocket";
import { StockChart } from "@/components/StockChart";
import { StockTable } from "@/components/StockTable";

// Тестовые наименования акций/валют
const symbols = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "BINANCE:BTCUSDT",
  "OANDA:EUR_USD",
  "BINANCE:ETHUSDT",
];

export default function Home() {
  const stocks = useStockWebSocket(symbols);

  return (
    <div>
      <h1>Биржевой монитор</h1>
      <StockChart stockData={stocks} />
      <StockTable stocks={stocks} />
    </div>
  );
}
