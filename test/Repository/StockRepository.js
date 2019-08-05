// @flow
import dotenv from 'dotenv';
//import assert from 'assert';
import StockRepository from "../../src/Repositories/StockRepository";
import StocksAlphaVantage from "../../src/APIs/StocksAlphaVantage";
import type {StockAPI} from "../../src/Interfaces/StockAPI";
import Ticker from "../../src/Models/Ticker";

dotenv.config();

describe('All tests', function () {
    let api: StockAPI;
    let repository: StockRepository;

    before(() => {
        api = new StocksAlphaVantage();
        repository = new StockRepository(api);
    });

    beforeEach(() => {

    });

    it('get ticker dependency mocked', function (done) {
        done();
    });
});
