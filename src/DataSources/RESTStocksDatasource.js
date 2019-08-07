// @flow
import StockRepository from "../Repositories/StockRepository";
import IEX from "../APIs/IEX";
import Ticker from "../Models/Ticker";
import {DataSource} from 'apollo-datasource';


//TODO: Make get_key name
export default class RESTStocksDatasource extends DataSource {

    api: StockAPI;

    constructor({api}: {api: StockAPI, store: any}) {
        super();
        this.api = api;
    }

    fetchTicker(symbol: string): Promise<Ticker> {
        return this.api.ticker(symbol)
    }

    fetchTickerNews(symbol: string): Promise<Ticker> {
        return this.api.tickerNews(symbol)
    }

    fetchTickerHistory(symbol: string, start: (string | Date), end: (string | Date)): Promise<Array<Ticker>> {
        return this.api.tickerHistory(symbol, start, end);
    }
}
