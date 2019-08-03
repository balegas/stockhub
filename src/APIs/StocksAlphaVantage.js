// @flow
import {StockAPI} from "../Interfaces/StockAPI";
import Ticker from "../Models/Ticker";
import config from "alphavantage";

export default class StocksAlphaVantage implements StockAPI {

    alpha: Object;

    constructor(props: Object) {
        this.alpha = config({key: process.env.API_KEY});
    }

    ticker(symbol: string): Promise<Ticker> {
        return this.alpha.data.quote(symbol)
            .then((data): any => {console.log("data", data); return Ticker})
            .then((data): Ticker => this.createTicker(data))
    }

    createTicker(data: { symbol: string }): Ticker {
        const {symbol} = data;
        return new Ticker({symbol});
    }
}


// mock { 'Global Quote':
//    { '01. symbol': 'BYND',
//      '02. open': '177.6000',
//      '03. high': '181.9100',
//      '04. low': '175.2700',
//      '05. price': '176.7700',
//      '06. volume': '4115824',
//      '07. latest trading day': '2019-08-02',
//      '08. previous close': '176.0400',
//      '09. change': '0.7300',
//      '10. change percent': '0.4147%' } }
