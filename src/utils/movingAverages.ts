import { CandleData } from "@/shared/interfaces";

// Простая скользящая средняя (Simple Moving Average)
export const calculateSMA = (data: CandleData[], period: number) => {
  if (data.length < period) return [];

  const sma: number[] = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data
      .slice(i - period + 1, i + 1)
      .reduce((acc, val) => acc + val.close, 0);
    sma.push(sum / period);
  }
  return sma;
};

// Экспоненциальная скользящая средняя (Exponential Moving Average)
export const calculateEMA = (data: CandleData[], period: number) => {
  if (data.length < period) return [];

  const ema: number[] = [];
  const k = 2 / (period + 1);

  // Начальное значение EMA - это SMA за начальный период
  const sma = calculateSMA(data, period);
  ema.push(sma[0]);

  // Рассчитываем EMA для остальной части данных
  for (let i = period; i < data.length; i++) {
    const price = data[i].close;
    const prevEma = ema[ema.length - 1];
    ema.push(price * k + prevEma * (1 - k));
  }

  return ema;
};
