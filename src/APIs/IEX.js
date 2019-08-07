// @flow
import type {StockAPI} from "../Interfaces/StockAPI";
import {IEXCloudClient} from "node-iex-cloud";
// import promise base library
import fetch from "node-fetch";
import Ticker from "../Models/Ticker";
import _ from "lodash";
import News from "../Models/News";


export default class IEX implements StockAPI {

    client: IEXCloudClient;

    constructor(props: Object = {}) {
        let {sandbox = true, API_KEY} = props;
        this.client = new IEXCloudClient(fetch, {
            sandbox: sandbox || false,
            publishable: API_KEY || process.env.API_KEY_IEX || process.env.API_KEY || '',
            version: "stable"
        });
    }

    ticker(symbol: string): Promise<Ticker> {
        return this.fetchTickerObj(symbol)
            .then((ticker): Object => {
                ticker.symbol = symbol;
                return ticker;
            })
            .then((data): Ticker => this.createTicker(data))
    }

    tickerNews(symbol: string): Promise<Array<News>> {
        return this.fetchTickerNewsObj(symbol)
            .then((data): Array<Object> => data.map((obj): News => this.createNews(obj)))
            .then((news): Array<News> => {news.sort((a, b): number => b.datetime - a.datetime); return news});
    }

    tickers(symbols: Array<string>): Promise<Array<Ticker>> {
        return Promise.all(symbols.map((s): Promise<Ticker> => this.ticker(s)));
    }

    //max 1 month
    tickerHistory(symbol: string, from: (Date | string), to: (Date | string)): Promise<Array<Ticker>> {
        let fromDate: Date = typeof from === 'string' ? new Date(from) : from;
        let toDate: Date = typeof to === 'string' ? new Date(to) : to;

        return this.fetchTickerHistoryObj(symbol, {type: '1m'})
            .then((res): Object => _.forEach(res, (v, k) => {
                res[k].symbol = symbol;
            }))
            .then((res): Object => _.filter(res, (v): boolean => {
                let date = new Date(v.date);
                return date >= fromDate && date <= toDate;
            }))
            .then((data): Array<Ticker> => {
                return _.map(data, (v): Ticker => {
                    return this.createTicker(v);
                })
            })
            .then((data): Array<Ticker> => {
                data.reverse();
                return data;
            })
            .then((data): Array<Ticker> => {
                for (let i = 0; i < data.length; i++) {
                    data[i].compute();
                }
                return data;
            });
    }

    fetchTickerObj(symbol: string): Promise<Object> {
        return this.client.symbol(symbol).quote();
    }

    fetchTickerNewsObj(symbol: string): Promise<Object> {
        return this.client.symbol(symbol).news(10);
    }

    //arg: 1m, 20190801...
    fetchTickerHistoryObj(symbol: string, {type, arg}: { type: string, arg?: string }): Promise<Object> {
        let query = arg ? type + '/' + arg : type;
        return this.client.symbol(symbol).chart(query)
            .then((obj) => {
                return obj;
            })
    }

    createTicker(data: Object): Ticker {
        let jsonTicker = Ticker.valueTypeMapper(data);
        return new Ticker(jsonTicker);
    }

    createNews(data: Object): News {
        let jsonNews = News.valueTypeMapper(data);
        return new News(jsonNews);
    }
}
