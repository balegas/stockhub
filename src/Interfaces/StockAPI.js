// @flow
import type Ticker from '../Models/Ticker';
import type News from '../Models/News';

export interface StockAPI {
    ticker(symbol: string): Promise<Ticker>,
    tickerNews(symbol: string): Promise<Array<News>>,
    tickerHistory(symbol: string, start: (string | Date), end: (string | Date)): Promise<Array<Ticker>>
}
