// @flow
import {StockAPI} from '../Interfaces/StockAPI';
import Ticker from '../Models/Ticker';

//TODO: Consider creating repository-level cache or controller level.
export default class StockRepository {

    api: StockAPI;

    constructor(api: StockAPI) {
        this.api = api;
    }

    ticker(symbol: string): Ticker {
        return this.api.ticker(symbol);
    }

}


