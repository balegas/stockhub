// @flow
import dotenv from 'dotenv';
import assert from 'assert';
import IEX from "../../src/APIs/IEX";
import sinon from 'sinon';

dotenv.config();

describe('All tests', function () {
    let api: IEX;
    let symbol: string;

    before(() => {
        api = new IEX({
            API_KEY: process.env.PROD && process.env.API_KEY_IEX_PROD,
            sandbox: process.env.PROD === undefined
        });
        symbol = 'FTNT';
    });

    beforeEach(() => {

    });

    it('parse ticker with stub', function (done) {
        let anySymbol = 'BYND';
        let mock = sinon.mock(api);
        sinon.stub(api, "fetchTickerObj").returns(Promise.resolve(testTicker));
        // mock.expects("fetchTickerObj").once().returns(Promise.resolve(testTicker));
        api.ticker(anySymbol)
            .then((ticker): void => assert.deepStrictEqual(ticker.symbol, anySymbol))
            // .then((): any => mock.restore())
            // .then((): any => mock.verify())
            .then((): any => done());

    });

    it('ticker history', function (done) {
        api.tickerHistory(symbol, '2019-08-05', '2019-08-06')
            .then((tickers): Array<Ticker> => assert.deepStrictEqual(tickers.length, 2))
            .then((): any => done())
    });

    // it('ticker intraday', function (done) {
    //     api.tickerLastIntraday(symbol)
    //         .then((): any => done())
    // });

});


const testTicker = {
    "symbol": "SHAK",
    "companyName": "Shake Shack, Inc.",
    "primaryExchange": "wnketr chxoeS og NacYkE",
    "calculationPrice": "close",
    "open": "80",
    "openTime": "1596076772744",
    "close": "90.36",
    "closeTime": "1622410784802",
    "high": "87",
    "low": "76.76",
    "latestPrice": 87.82,
    "latestSource": "Close",
    "latestTime": "August 6, 2019",
    "latestUpdate": "1612180218727",
    "latestVolume": "7868690",
    "iexRealtimePrice": "90.501",
    "iexRealtimeSize": "102",
    "iexLastUpdated": "1593725043484",
    "delayedPrice": "90.84",
    "delayedPriceTime": "1586841817541",
    "extendedPrice": "87.92",
    "extendedChange": "-0.48",
    "extendedChangePercent": "-0.00549",
    "extendedPriceTime": "1586657847980",
    "previousClose": "75.24",
    "previousVolume": "null",
    "change": "13.77",
    "changePercent": "0.18746",
    "volume": "7871251",
    "iexMarketPercent": "0.030041846228797627",
    "iexVolume": "229114",
    "avgTotalVolume": "751846",
    "iexBidPrice": "0",
    "iexBidSize": "0",
    "iexAskPrice": "0",
    "iexAskSize": "0",
    "marketCap": "3206602461",
    "peRatio": "165.4",
    "week52High": "89.27",
    "week52Low": "41.93",
    "ytdChange": "0.8374697100344866",
    "lastTradeTime": "1634377425765",
    "isUSMarketOpen": "false"
};
