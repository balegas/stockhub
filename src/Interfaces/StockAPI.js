// @flow
import Ticker from '../Models/Ticker';
import News from '../Models/News';

export interface Stocks {
    ticker(symbol: string): Promise<Ticker>,
    tickerNews(symbol: string): Promise<Array<News>>,
    tickerHistory(symbol: string, start: (string | Date), end: (string | Date)): Promise<Array<Ticker>>
}
