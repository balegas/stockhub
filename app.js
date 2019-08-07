// @flow
import dotenv from 'dotenv';
import express from 'express';
import {ApolloServer, gql} from 'apollo-server-express';
import {GraphQLScalarType, Kind} from 'graphql';
import Ticker from './src/Models/Ticker';
import type News from './src/Models/News';
import RestStocksDatasource from './src/DataSources/RESTStocksDatasource';
import IEX from './src/APIs/IEX';
import StockRepository from "./src/Repositories/StockRepository";

const {RedisCache} = require('apollo-server-cache-redis');

dotenv.config();

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
    scalar Date

    type News {
        headline: String!,
        datetime: Date,
        source: String,
        url: String
        summary: String,
        related: String,
        image: String,
        lang: String,
        hasPaywall: Boolean
    }

    type Ticker {
        symbol : String!
        open: Float,
        close: Float,
        high: Float,
        low: Float,
        latestPrice: Float,
        previousClose: Float,
        change: Float,
        changePercent: Float,
        extendedPrice: Float,
        extendedChange: Float,
        extendedChangePercent: Float,
        extendedPriceTime: Float,
        ytdChange: Float,

        date: Float,
        percentageAtOpen: Float,

        history(start: String!, end: String!) : [Ticker],
        news: [News]

    }

    type Query {
        ticker( symbol: String!) : Ticker
        tickers( symbols: [String]!) : [Ticker]
    }
`;

//TODO: Consider adding support for multiple sources if consuming from different APIs
//https://medium.com/@awesome1888/how-to-use-graphql-apollo-server-with-serverless-606430ad94b3

const resolvers = {
    Query: {
        ticker: (obj, {symbol}, context, info): Promise<Ticker> => {
            return context.dataSources.stockRepository.ticker(symbol)
        },

        tickers: (obj, {symbols}, context, info): Promise<Ticker> => {
            return context.dataSources.stockRepository.tickers(symbols)
        }
    },

    Ticker: {
        history: ({symbol}, {start, end}, context): Promise<Array<Ticker>> => context.dataSources.stockRepository.tickerHistory(symbol, start, end),
        news: ({symbol}, args, context): Promise<Array<News>> => {
            return context.dataSources.stockRepository.tickerNews(symbol)
        }
    },

    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value: any): ?Date {
            if (typeof value === 'string') {
                return new Date(value); // value from the client
            }
            if (typeof value === 'number') {
                const date: Date = new Date();
                date.setTime(value);
                return date;
            }
        },

        serialize(value: any): ?number {
            if (typeof value === Date) {
                return value.getTime();
            }
            if (typeof value === 'number') {
                return new Date(value).getTime();
            }
            if (typeof value === 'string') {
                return Date.parse(value);
            }
        },

        parseLiteral(ast: any): ?number {
            if (ast.kind === Kind.INT) {
                return parseInt(ast.value, 10); // ast value is always in string format
            }
        }
    }),
};

process.env.DISABLE_CACHE && console.log("API", "PROD", process.env.PROD, "sandbox", !process.env.PROD);
const api = new IEX({API_KEY: process.env.PROD && process.env.API_KEY_IEX_PROD, sandbox: !process.env.PROD});

process.env.DISABLE_CACHE && console.log("cache disabled");
const cache = !process.env.DISABLE_CACHE && new RedisCache({
    host: 'localhost',
    connectTimeout: 5000,
    retryStrategy: function (times): any {
        if (times >= 3) {
            return new Error('Retry attempts exhausted');
        }
        var delay = Math.min(times * 50, 2000);
        return delay
    },
    socket_keepalive: false,
});

const datasource = new RestStocksDatasource({api});

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: (): Object => ({stockRepository: new StockRepository({datasource, cache})}),
    context: (): Object => {
    }
});
const app = express();

server.applyMiddleware({app});

app.listen({port: 4000}, (): any =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
