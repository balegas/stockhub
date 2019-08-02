// @flow
import Ticker from '../Models/Ticker';

export interface StockAPI {
    ticker(symbol: string): Ticker
}
