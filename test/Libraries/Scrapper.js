// @flow
import assert from 'assert';
import Scrapper from "../../src/Libraries/Scrapper";
import fs from "fs";


describe('Test Basic document', function () {
    let document;

    before(() => {
        document = "../res/webpages/basic-test.html";


    });

    beforeEach(() => {

    });

    it('extract fruits from basic document', function (done) {
        fs.readFile(__dirname + '/' + document, function (err, documentData) {
            if (err) {
                throw err;
            }
            let res = Scrapper.scrap(documentData.toString(), [(doc) => doc('.apple', '#fruits').text()]);
            assert.deepStrictEqual(res[0], "Apple");
            done()
        });
    });

});
