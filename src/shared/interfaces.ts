export interface StockTableProps {
  stocks: StockData[];
}
export interface StockData {
  /** Символ акции */
  symbol: string;
  /** Текущая цена */
  c: number; // current price
  /** Цена открытия */
  o: number; // open price
  /** Максимальная цена */
  high?: number; // high price
  /** Минимальная цена */
  low?: number; // low price
  /** Изменение цены за день в процентах */
  dp?: number;
}
export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}
