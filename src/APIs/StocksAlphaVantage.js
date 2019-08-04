// @flow
import {StockAPI} from "../Interfaces/StockAPI";
import Ticker from "../Models/Ticker";
import config from "alphavantage";

export default class StocksAlphaVantage implements StockAPI {

    key: string;
    alpha: Object;

    constructor(props: Object = {}) {
        this.key = props.API_KEY || process.env.API_KEY || '';
        this.alpha = config({key: this.key});
    }

    ticker(symbol: string): Promise<Ticker> {
        return this.fetchTickerObj(symbol)
            .then((data): Ticker => this.createTicker(data))

    }

    createTicker(data: { symbol: string }): Ticker {
        let jsonTicker = this.parse(data);
        return new Ticker(jsonTicker);
    }

    fetchTickerObj(symbol: string): Promise<Object> {
        return this.alpha.data.quote(symbol)
    }

    parse(jsonTicker: Object): Object {
        const baseKey = 'Global Quote';
        const reg = /\d*\.\s(\w*)/;
        let res = {};
        Object.keys(jsonTicker[baseKey]).forEach(k => {
            let m: ?Array<any> = reg.exec(k);
            if (m && m[1]) {
                res[m[1]] = jsonTicker[baseKey][k]
            }
        });
        return res;
    }
}
