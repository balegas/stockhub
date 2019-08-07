// @flow
import dotenv from 'dotenv';
import assert from 'assert';
import IEX from "../../src/APIs/IEX";
import sinon from 'sinon';

dotenv.config();

describe('All tests', function () {
    let api: IEX;
    let testSymbol: string;

    before(() => {
        api = new IEX({
            API_KEY: process.env.PROD && process.env.API_KEY_IEX_PROD,
            sandbox: process.env.PROD === undefined
        });
        testSymbol = 'SHAK';
    });

    beforeEach(() => {

    });

    it('parse ticker with stub', function (done) {
        let mock = sinon.mock(api);
        sinon.stub(api, "fetchTickerObj").returns(Promise.resolve(testTicker));
        // mock.expects("fetchTickerObj").once().returns(Promise.resolve(testTicker));
        api.ticker(testSymbol)
            .then((ticker): void => assert.deepStrictEqual(ticker.symbol, testSymbol))
            // .then((): any => mock.restore())
            // .then((): any => mock.verify())
            .then((): any => done());

    });

    it('ticker history', function (done) {
        api.tickerHistory(testSymbol, '2019-08-05', '2019-08-06')
            .then((tickers): Array<Ticker> => assert.deepStrictEqual(tickers.length, 2))
            .then((): any => done())
    });

    it('ticker news', function (done) {
        api.tickerNews(testSymbol)
            .then((res): any => console.log(res))
            .then((): any => done())
    });

    it('tickers', function (done) {
        sinon.stub(api, "fetchTickerNewsObj").returns(Promise.resolve(testTickerNews));
        api.tickers([testSymbol, testSymbol])
            .then((tickers): Array<Ticker> => assert.deepStrictEqual(tickers.length, 2))
            .then((): any => done())
    });

});


const testTicker = {
    "symbol": "SHAK",
    "companyName": "Shake Shack, Inc.",
    "primaryExchange": "wnketr chxoeS og NacYkE",
    "calculationPrice": "close",
    "open": 80,
    "openTime": 1596076772744,
    "close": 90.36,
    "closeTime": 1622410784802,
    "high": 87,
    "low": 76.76,
    "latestPrice": 87.82,
    "latestSource": "Close",
    "latestTime": "August 6, 2019",
    "latestUpdate": 1612180218727,
    "latestVolume": 7868690,
    "iexRealtimePrice": 90.501,
    "iexRealtimeSize": 102,
    "iexLastUpdated": 1593725043484,
    "delayedPrice": 90.84,
    "delayedPriceTime": 1586841817541,
    "extendedPrice": 87.92,
    "extendedChange": -0.48,
    "extendedChangePercent": -0.00549,
    "extendedPriceTime": 1586657847980,
    "previousClose": 75.24,
    "previousVolume": null,
    "change": 13.77,
    "changePercent": 0.18746,
    "volume": 7871251,
    "iexMarketPercent": 0.030041846228797627,
    "iexVolume": 229114,
    "avgTotalVolume": 751846,
    "iexBidPrice": 0,
    "iexBidSize": 0,
    "iexAskPrice": 0,
    "iexAskSize": 0,
    "marketCap": 3206602461,
    "peRatio": 165.4,
    "week52High": 89.27,
    "week52Low": 41.93,
    "ytdChange": 0.8374697100344866,
    "lastTradeTime": 1634377425765,
    "isUSMarketOpen": false
};

const testTickerNews = [
    {
        "datetime":1565114040000,
        "headline":"StockBeat: Shake Shack Hits Year High as International Growth Beefs up Earnings",
        "source":"Investing.com",
        "url":"https://cloud.iexapis.com/v1/news/article/cc0a9f51-dc5d-4be1-a1eb-7b7618defab6",
        "summary":"https://www.investing.com/news/stock-market-news/stockbeat-shake-shack-hits-year-high-as-international-growth-beefs-up-earnings-1946848",
        "related":"SHAK",
        "image":"https://cloud.iexapis.com/v1/news/image/cc0a9f51-dc5d-4be1-a1eb-7b7618defab6",
        "lang":"en",
        "hasPaywall":false
    },
    {
        "datetime":1565108827000,
        "headline":"At Year Highs, Can Shake Shack Run Another 18% Now?",
        "source":"The Street",
        "url":"https://cloud.iexapis.com/v1/news/article/50c7ecb4-2a17-4af5-988d-eb81d370e9c0",
        "summary":"Shake Shack stock is jumping to new 52-week highs, but investors want to know if SHAK stock can get to new all-time highs after earnings….SHAK",
        "related":"SHAK",
        "image":"https://cloud.iexapis.com/v1/news/image/50c7ecb4-2a17-4af5-988d-eb81d370e9c0",
        "lang":"en",
        "hasPaywall":false
    }
];
