"use client";

import { WS_URL } from "@/shared/constants";
import { StockData } from "@/shared/interfaces";
import { useEffect, useRef, useState } from "react";

export const useStockWebSocket = (symbols: string[]): StockData[] => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen = () => {
      console.log("WebSocket подключен");
      symbols.forEach((symbol) =>
        ws.current?.send(JSON.stringify({ type: "subscribe", symbol }))
      );
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "trade") {
        const updatedStocks: StockData[] = data.data.map(
          (trade: TradeData) => ({
            symbol: trade.s,
            c: trade.p,
          })
        );

        setStocks((prevStocks) => {
          const stockMap = new Map(prevStocks.map((s) => [s.symbol, s]));

          updatedStocks.forEach((stock) => {
            const existingStock = stockMap.get(stock.symbol);
            if (existingStock) {
              stockMap.set(stock.symbol, {
                ...existingStock,
                c: stock.c,
                o: stock.o ?? stock.c,
              });
            } else {
              stockMap.set(stock.symbol, {
                symbol: stock.symbol,
                c: stock.c,
                o: stock.o ?? stock.c,
              });
            }
          });

          return Array.from(stockMap.values());
        });
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket ошибка:", error);
    };

    ws.current.onclose = () => {
      console.log("WebSocket соединение закрыто");
    };

    return () => {
      symbols.forEach((symbol) =>
        ws.current?.send(JSON.stringify({ type: "unsubscribe", symbol }))
      );
      ws.current?.close();
    };
  }, [symbols]);

  return stocks;
};
