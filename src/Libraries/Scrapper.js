// @flow
import cheerio from 'cheerio';


export default class Scrapper {

    static scrap(document: string, selectorFunctions: Array<function>): Array<string> {
        let doc1 = cheerio.load(document);
        return selectorFunctions.map((f): any => f(doc1));
    }
}
