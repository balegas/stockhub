// @flow
import {StockAPI} from "../Interfaces/StockAPI";
import Ticker from "../Models/Ticker";
import config from "alphavantage";
import _ from 'lodash';

const baseKey = 'Global Quote';
const dailyBaseKey = 'Time Series (Daily)';
const intradayBaseKey = 'Time Series (1min)';

export default class StocksAlphaVantage implements StockAPI {

    key: string;
    alpha: Object;

    constructor(props: Object = {}) {
        this.key = props.API_KEY || process.env.API_KEY_AV || process.env.API_KEY || '';
        this.alpha = config({key: this.key});
    }

    ticker(symbol: string): Promise<Ticker> {
        return this.fetchTickerObj(symbol)
            .then((data): Ticker => this.createTicker(data))

    }

    tickerHistory(symbol: string, from: (Date | string), to: (Date | string)): Promise<Array<Ticker>> {
        let fromDate: Date = typeof from === 'string' ? new Date(from) : from;
        let toDate: Date = typeof to === 'string' ? new Date(to) : to;

        return this.fetchTickerDailyObj(symbol)
            .then((res): Object => _.forEach(res, (v, k) => {
                res[k].date = k;
                res[k].symbol = symbol;
            }))
            .then((res): Object => _.filter(res, (v, k): boolean => {
                let date = new Date(k);
                return date >= fromDate && date <= toDate;
            }))
            .then((data): Array<Ticker> => {
                return _.map(data, (v): Ticker => {
                    return this.createTicker(v);
                })
            })
            .then((data): Array<Ticker> => {
                for (let i = 0; i < data.length - 1; i++) {
                    data[i].previous_close = data[i + 1].last;
                }
                return data;
            })
            .then((data): Array<Ticker> => {
                for (let i = 0; i < data.length; i++) {
                    data[i].recompute();
                }
                return data;
            });
    }

    tickerLastIntraday(symbol: string): Object {
        return this.fetchTickerIntradayObj(symbol)
            .then((res): Object => _.forEach(res, (v, k) => {
                res[k].date = k;
                res[k].symbol = symbol;
            }))
            .then((data): Array<Ticker> => {
                return _.map(data, (v): Ticker => {
                    return this.createTicker(v);
                })
            })
            .then((data): Array<Ticker> => {
                for (let i = 0; i < data.length; i++) {
                    data[i].recompute();
                }
                return data;
            })

    }

    createTicker(data: { symbol: string }): Ticker {
        let json = this.parse(data);
        let jsonTicker = this.jsonToTickerJson(json);
        return new Ticker(jsonTicker);
    }

    jsonToTickerJson(json: Object): Object {
        const newKeys = _.mapKeys(json, (v, k): string => {
            switch (k) {
                case 'close':
                    return 'last';
                case 'latest trading day':
                    return 'date';
                case 'change percent':
                    return 'percentage';
                case 'previous close':
                    return 'previous_close';
                case 'price':
                    return 'last';
                default:
                    return k;
            }
        });

        return Ticker.valueTypeMapper(newKeys);
    }

    fetchTickerObj(symbol: string): Promise<Object> {
        return this.alpha.data.quote(symbol)
            .then((data): Object => data[baseKey]);
    }

    fetchTickerDailyObj(symbol: string): Promise<Object> {
        return this.alpha.data.daily(symbol, 'compact')
            .then((data): Object => data[dailyBaseKey]);
    }

    fetchTickerIntradayObj(symbol: string): Promise<Object> {
        return this.alpha.data.intraday(symbol, 'full')
            .then((data): Object => data[intradayBaseKey]);
    }

    parse(jsonTicker: Object): Object {
        const reg = /\d*\.\s((\w|\s)*)/;
        let res = {};
        Object.keys(jsonTicker).forEach(k => {
            let m: ?Array<any> = reg.exec(k);
            if (m && m[1]) {
                res[m[1]] = jsonTicker[k];
            } else {
                res[k] = jsonTicker[k];
            }
        });
        return res;
    }
}
