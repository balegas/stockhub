// @flow
import {StockAPI} from '../Interfaces/StockAPI';
import Ticker from '../Models/Ticker';
import {DataSource, type KeyValueCache} from "apollo-datasource";
import {MongoClient, ObjectId} from 'mongodb';

const fetchKeyPrefix = "ticker-";

export default class StockRepository {

    datasource: DataSource;
    cache: KeyValueCache;


    constructor({datasource, cache}: {datasource: DataSource, cache: KeyValueCache}) {
        this.datasource = datasource;
        this.cache = cache;
    }

    //TODO: Cache Get/put abstractions
    ticker(symbol: string): Promise<Ticker> {
        const resolve = (res): Promise<Ticker> => {
            if (res) {
                const json = JSON.parse(res);
                return new Ticker(json);
            } else {
                return this.datasource.fetchTicker(symbol)
                    .then((ticker): Ticker => {
                        if (this.cache) {
                            this.cache.set(fetchKeyPrefix + symbol, JSON.stringify(ticker), {ttl: 30});
                        }
                        return ticker;
                    });
            }
        };

        if (this.cache) {
            return this.cache.get(fetchKeyPrefix + symbol).then(resolve)
        } else {
            return resolve();
        }
    }

    tickers(symbols: Array<string>): Array<Ticker> {
        return Promise.all(symbols.map((s): Ticker => this.ticker(s)));
    }

    tickerNews(symbol: string): Array<News> {
        return this.datasource.fetchTickerNews(symbol);
    }

    tickerHistory(symbol: string, start: (string | Date), end: (string | Date)): Promise<Array<Ticker>> {
        return this.dataSource.fetchTickerHistory(symbol, start, end);
    }
}
