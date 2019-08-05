// @flow
import {StockAPI} from '../Interfaces/StockAPI';
import Ticker from '../Models/Ticker';


//TODO: Consider creating repository-level cache or controller level.
export default class StockRepository {

    api: StockAPI;

    constructor(api: StockAPI) {
        this.api = api;

    }

    ticker(symbol: string): Promise<Ticker> {
        return this.api.ticker(symbol);
    }

    tickerHistory(symbol: string, start: (string | Date), end: (string | Date)): Promise<Array<Ticker>> {
        return this.api.tickerHistory(symbol, start, end);
    }
}
