// @flow
import Ticker from '../Models/Ticker';

export interface StockAPI {
    ticker(symbol: string): Promise<Ticker>,
    tickerHistory(symbol: string, start: (string | Date), end: (string | Date)): Promise<Array<Ticker>>
}
