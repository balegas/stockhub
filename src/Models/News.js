// @flow
import _ from "lodash";

export default class News {

    datetime: Date;
    headline: string;
    source: ?string;
    url: ?string;
    summary: ?string;
    related: ?string;
    image: ?string;
    lang: ?string;
    hasPaywall: ?boolean;

    constructor(props: Object) {
        this.datetime = props.datetime;
        this.headline = props.headline;
        this.source = props.source;
        this.url = props.url;
        this.summary = props.summary;
        this.related = props.related;
        this.image = props.image;
        this.lang = props.lang;
        this.hasPaywall = props.hasPaywall;
    }

    static valueTypeMapper(obj: Object): Object {
        return _.mapValues(obj, (v, k): any => {
            switch (k) {
                case 'datetime':
                    return News.parseDateNotNull(v);
                default:
                    return v;
            }
        });
    }

    static parseDateNotNull(date: Date): ?Date {
        // let newDate = new Date();
        // if (date) {
        //     newDate.setTime(date);
        // }
        // return newDate;
        return date
    }
}
