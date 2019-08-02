//@flow
export default class Ticker {

    symbol: string;
    high: ?number;
    low: ?number;
    current: ?number;
    start: ?Date;
    end: ?Date;

    constructor(props: { symbol: string, high?: number, low?: number, current?: number, start?: Date, end?: Date }) {
        this.symbol = props.symbol;
        this.high = props.high;
        this.low = props.low;
        this.current = props.current;
        this.start = props.start;
        this.end = props.end;
    }
}
