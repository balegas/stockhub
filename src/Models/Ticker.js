// @flow
export default class Ticker {

    symbol: string;
    high: ?number;
    low: ?number;
    open: ?number;
    last: ?number;
    date: ?Date;
    previous_close: ?number;
    change: ?number;
    percentage: ?number;
    percentageAtOpen: ?number;

    constructor(props: { symbol: string, high?: number, low?: number, open?: number, last?: number, date?: Date, previous_close: ?number, change?: number }) {
        this.symbol = props.symbol;
        this.high = props.high;
        this.low = props.low;
        this.open = props.open;
        this.last = props.last;
        this.date = props.date;
        this.previous_close = props.previous_close;
        this.change = props.change;
        this.recompute();
    }

    recompute() {
        if (this.open && this.last) {
            this.change = parseFloat(new Number(this.last - this.open).toFixed(3));
        }
        if (this.change && this.last) {
            this.percentage = parseFloat(new Number((this.change / this.last) * 100).toFixed(3));
        }
        if (this.open && this.previous_close) {
            this.percentageAtOpen = parseFloat(new Number(((this.open - this.previous_close) / this.open) * 100).toFixed(3));
        }
    }

}
