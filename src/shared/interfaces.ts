export interface StockTableProps {
  stocks: StockData[];
}
export interface StockData {
  /** Символ акции */
  symbol: string;
  /** Текущая цена */
  c: number;
  /** Цена открытия */
  o: number;
  /** Максимальная цена */
  high?: number;
  /** Минимальная цена */
  low?: number;
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
