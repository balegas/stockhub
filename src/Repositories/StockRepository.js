// @flow
import Ticker from '../Models/Ticker';
import News from '../Models/News';
import {DataSource, type KeyValueCache} from "apollo-datasource";

const fetchKeyPrefix = "ticker-";

export default class StockRepository {

    datasource: DataSource;
    cache: KeyValueCache;


    constructor({datasource, cache}: { datasource: DataSource, cache: KeyValueCache }) {
        this.datasource = datasource;
        this.cache = cache;
    }

    //TODO: Cache Get/put abstractions
    ticker(symbol: string): Promise<Ticker> {
        let resolve = (): Promise<Ticker> => {
            return this.datasource.fetchTicker(symbol)
                .then((ticker): Ticker => {
                    if (this.cache) {
                        this.cache.set(fetchKeyPrefix + symbol, JSON.stringify(ticker), {ttl: 30});
                    }
                    return ticker;
                });
        };

        if (this.cache) {
            return this.cache.get(fetchKeyPrefix + symbol)
                .then((res): Promise<Ticker> => {
                    if (res) {
                        const json = JSON.parse(res);
                        return Promise.resolve(new Ticker(json));
                    }else{
                        return resolve();
                    }
                })
        } else {
            return resolve();
        }
    }

    tickers(symbols: Array<string>): Promise<Array<Ticker>> {
        return Promise.all(symbols.map((s): Promise<Ticker> => this.ticker(s)));
    }

    tickerNews(symbol: string): Array<News> {
        return this.datasource.fetchTickerNews(symbol);
    }

    tickerHistory(symbol: string, start: (string | Date), end: (string | Date)): Promise<Array<Ticker>> {
        return this.datasource.fetchTickerHistory(symbol, start, end);
    }
}
