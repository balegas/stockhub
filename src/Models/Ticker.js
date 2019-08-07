// @flow
import _ from "lodash";

export default class Ticker {
    //TODO: add open and close times to enable intraday
    symbol: string;
    open: ?number;
    close: ?number;
    high: ?number;
    low: ?number;
    //TODO: make sure that latestPrice reflects the pre-market price
    latestPrice: ?number;
    previousClose: ?number;
    change: ?number;
    changePercent: ?number;
    extendedPrice: ?number;
    extendedChange: ?number;
    extendedChangePercent: ?number;
    extendedPriceTime: ?number;
    ytdChange: ?number;

    //For historical data
    date: ?Date;

    //TODO: see if this value needs to be calculated at pre market. i.e. aftermarket and pre-market values vary
    percentageAtOpen: ?number;


    constructor(props: Object) {

        this.symbol = props.symbol;
        this.open = props.open;
        this.close = props.close;
        this.high = props.high;
        this.low = props.low;
        this.latestPrice = props.latestPrice;
        this.previousClose = props.previousClose;
        this.change = props.change;
        this.changePercent = props.changePercent;
        this.extendedPrice = props.extendedPrice;
        this.extendedChange = props.extendedChange;
        this.extendedChangePercent = props.extendedChangePercent;
        this.extendedPriceTime = props.extendedPriceTime;
        this.ytdChange = props.ytdChange;

        this.date = props.date;

        this.compute();
    }

    compute() {
        //TODO: check if latestPrice or open should be used here
        if (this.latestPrice && this.previousClose) {
            this.percentageAtOpen = parseFloat(new Number(((this.latestPrice - this.previousClose) / this.latestPrice) * 100).toFixed(3));
        }
    }

    static valueTypeMapper(obj: Object): Object {
        return _.mapValues(obj, (v, k): any => {
            switch (k) {
                case 'date':
                    return Ticker.parseDateNotNull(v);
                // case 'open':
                // case 'close':
                // case 'high':
                // case 'low':
                // case 'latestPrice':
                // case 'previousClose':
                // case 'change':
                // case 'changePercent':
                // case 'extendedPrice':
                // case 'extendedChange':
                // case 'extendedChangePercent':
                // case 'extendedPriceTime':
                // case 'ytdChange':
                //     return Ticker.parseFloatNotNull(v);
                default:
                    return v;
            }
        });
    }

    static parseDateNotNull(date: any): ?Date {
        if (date) {
            return new Date(date);
        }
    }

    static parseFloatNotNull(float: any): ?number {
        if (float) {
            return parseFloat(float);
        }
    }

}
