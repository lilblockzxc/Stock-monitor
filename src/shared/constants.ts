export enum EFilter {
  ALL = "all",
  UP = "up",
  DOWN = "down",
}
export const API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

export const WS_URL = `wss://ws.finnhub.io?token=${API_KEY}`;
