// @flow
import dotenv from 'dotenv';
//import assert from 'assert';
import StockRepository from "../src/Repositories/StockRepository";
import StocksAlphaVantage from "../src/APIs/StocksAlphaVantage";
import type {StockAPI} from "../src/Interfaces/StockAPI";
import Ticker from "../src/Models/Ticker";

dotenv.config();

describe('All tests', function () {
    let api: StockAPI;
    let repository: StockRepository;

    before(() => {});


    beforeEach(() => {
        api = new StocksAlphaVantage();
        repository = new StockRepository(api);
    });

    it('get ticker dependency mocked', function (done) {
        // spy = spyOn(service, 'isAuthenticated').and.returnValue(false);
        repository.ticker('BYND')
            .then((res): Ticker => {
                console.log(res);
                return res
            })
            .then((): any => done())
    });
});
