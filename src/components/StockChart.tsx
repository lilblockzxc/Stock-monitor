"use client";

import React, { useEffect, useState, useRef, FC } from "react";
import {
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  BarProps,
} from "recharts";

import { CandleShape } from "@/components/CandleShape";
import { CandleData, StockData } from "@/shared/interfaces";

interface StockChartProps {
  stockData: StockData[];
}
/**Компонент отображения графика с информацией по выбранной акции */
export const StockChart: FC<StockChartProps> = ({ stockData }) => {
  const [chartData, setChartData] = useState<CandleData[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Выбранный интервал
  const [intervalSeconds, setIntervalSeconds] = useState(5);

  // Выбранный символ акции
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");

  // Промежуточный буфер данных для формирования свечи
  const candleBuffer = useRef<StockData[]>([]);
  const lastCandleCloseTime = useRef<number>(Date.now());
  const lastSelectedSymbol = useRef<string>(selectedSymbol);
  const lastCandleClose = useRef<number | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !selectedSymbol) return;
    if (selectedSymbol !== lastSelectedSymbol.current) {
      setChartData([]);
      candleBuffer.current = [];
      lastCandleCloseTime.current = Date.now();
      lastSelectedSymbol.current = selectedSymbol;
      lastCandleClose.current = null;
    }

    stockData
      .filter((stock) => stock.symbol === selectedSymbol)
      .forEach((stock) => {
        candleBuffer.current.push(stock);

        const now = Date.now();
        if (now - lastCandleCloseTime.current >= intervalSeconds * 1000) {
          if (candleBuffer.current.length === 0) return;

          const open = lastCandleClose.current ?? candleBuffer.current[0].o;
          const close = candleBuffer.current[candleBuffer.current.length - 1].c;
          const high = Math.max(
            ...candleBuffer.current
              .map((s) => s.high)
              .filter((h): h is number => h !== undefined)
          );
          const low = Math.min(
            ...candleBuffer.current
              .map((s) => s.low)
              .filter((l): l is number => l !== undefined)
          );

          const newCandle: CandleData = {
            time: new Date().toLocaleTimeString(),
            open,
            high,
            low,
            close,
          };

          setChartData((prevData) => [...prevData, newCandle].slice(-20));
          candleBuffer.current = [];
          lastCandleCloseTime.current = now;
          lastCandleClose.current = close;
        }
      });
  }, [stockData, selectedSymbol, intervalSeconds, isClient]);

  // Для избежания ошибки гидратации
  if (!isClient) return null;

  // Доступные символы для выбора
  const availableSymbols = stockData.map((stock) => stock.symbol);

  // Текущая информация о выбранной акции
  const currentStock = stockData.find((s) => s.symbol === selectedSymbol);

  return (
    <div style={{ overflowY: "hidden" }}>
      <div style={{ marginBottom: "10px" }}>
        <label>Выберите символ акции: </label>
        <select
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value)}
        >
          <option value="" disabled>
            Выберите акцию
          </option>
          {availableSymbols.map((symbol) => (
            <option key={symbol} value={symbol}>
              {symbol}
            </option>
          ))}
        </select>
      </div>

      {currentStock && (
        <div style={{ marginBottom: "10px" }}>
          <h3>Информация по акции {currentStock.symbol}:</h3>
          <p>Текущая цена: {currentStock.c}</p>
          <p>
            Изменение за день:{" "}
            {currentStock.dp !== undefined
              ? currentStock.dp.toFixed(2) + "%"
              : (
                  ((currentStock.c - currentStock.o) / currentStock.o) *
                  100
                ).toFixed(2) + "%"}
            ({currentStock.c >= currentStock.o ? "Растущая" : "Падающая"})
          </p>
        </div>
      )}

      <div style={{ marginBottom: "10px" }}>
        <label>Интервал свечей: </label>
        <select
          value={intervalSeconds}
          onChange={(e) => setIntervalSeconds(Number(e.target.value))}
        >
          <option value={5}>5 сек</option>
          <option value={15}>15 сек</option>
          <option value={30}>30 сек</option>
          <option value={60}>1 мин</option>
          <option value={300}>5 мин</option>
          <option value={900}>15 мин</option>
        </select>
      </div>

      {chartData.length > 0 ? (
        <ComposedChart
          width={1000}
          height={500}
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis />

          <Bar
            dataKey="close"
            fill="#8884d8"
            isAnimationActive={true}
            shape={(props: BarProps) => <CandleShape {...props} />}
          />
        </ComposedChart>
      ) : (
        <p>
          Выберите акцию или немного подождите, пока свеча сформируется исходя
          из данных и интервала
        </p>
      )}
    </div>
  );
};
