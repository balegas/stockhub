// @flow
import dotenv from 'dotenv';
import assert from 'assert';
import StocksAlphaVantage from "../src/APIs/StocksAlphaVantage";
import type Ticker from "../src/Models/Ticker";
import sinon from 'sinon';

dotenv.config();

describe('All tests', function () {
    let api: StocksAlphaVantage;

    before(() => {

    });

    beforeEach(() => {

    });

    it('parse ticker with stub', function (done) {
        let api = new StocksAlphaVantage();
        let anySymbol = 'BYND';
        // let mock = sinon.mock(api);
        sinon.stub(api, "fetchTickerObj").returns(Promise.resolve(testTicker));
        // mock.expects("fetchTickerObj").once().returns(Promise.resolve(testTicker));
        api.ticker(anySymbol)
            .then((ticker): void => assert.deepStrictEqual(ticker.symbol, anySymbol))
            // .then((): any => mock.restore())
            // .then((): any => mock.verify())
            .then((): any => done());

    });

});


const testTicker = {
    'Global Quote': {
        '01. symbol': 'BYND',
        '02. open': '177.6000',
        '03. high': '181.9100',
        '04. low': '175.2700',
        '05. price': '176.7700',
        '06. volume': '4115824',
        '07. latest trading day': '2019-08-02',
        '08. previous close': '176.0400',
        '09. change': '0.7300',
        '10. change percent': '0.4147%'
    }
};
