// @flow
import StockRepository from "../Repositories/StockRepository";
import StocksAlphaVantage from "../APIs/StocksAlphaVantage";
import Ticker from "../Models/Ticker";
import {DataSource} from 'apollo-datasource';
import {KeyValueCache} from 'apollo-server-caching';

const fetchKeyPrefix = "ticker-";


//TODO: Make get_key name
export default class TickerAPI extends DataSource {

    repository: StockRepository;
    cache: KeyValueCache;

    constructor({cache}: { cache: KeyValueCache }) {
        super();
        this.repository = new StockRepository(new StocksAlphaVantage());
        this.cache = cache;
    }

    fetchTicker(symbol: string, noCache: boolean = false): Promise<Ticker> {
        let promise;
        //TODO: abstract
        if (this.cache && !noCache) {
            promise = this.cache.get(fetchKeyPrefix + symbol).then((res): Object => {
                if (!res) {
                    return this.fetchTicker(symbol, true);
                } else {
                    return JSON.parse(res);
                }
            });
        } else {
            promise = this.repository.ticker(symbol)
                .then((ticker): Ticker => {
                    if (this.cache) {
                        this.cache.set(fetchKeyPrefix + symbol, JSON.stringify(ticker));
                    }
                    return ticker;
                })
        }
        return promise;

    }

    fetchTickerHistory(symbol: string, start: (string | Date), end: (string | Date)): Promise<Array<Ticker>> {
        return this.repository.tickerHistory(symbol, start, end);
    }
}
