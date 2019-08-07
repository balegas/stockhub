// @flow
import {StockAPI} from "../Interfaces/StockAPI";
import type Ticker from "../Models/Ticker";
import type News from "../Models/News";
import {DataSource} from 'apollo-datasource';


//TODO: Make get_key name
export default class RESTStocksDatasource extends DataSource {

    api: StockAPI;

    constructor(props: {api: StockAPI, store?: any}) {
        super();
        this.api = props.api;
    }

    fetchTicker(symbol: string): Promise<Ticker> {
        return this.api.ticker(symbol)
    }

    fetchTickerNews(symbol: string): Promise<Array<News>> {
        return this.api.tickerNews(symbol)
    }

    fetchTickerHistory(symbol: string, start: (string | Date), end: (string | Date)): Promise<Array<Ticker>> {
        return this.api.tickerHistory(symbol, start, end);
    }
}
