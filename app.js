// @flow
import dotenv from 'dotenv';
import express from 'express';
import {ApolloServer, gql} from 'apollo-server-express';
import {GraphQLScalarType, Kind} from 'graphql';
import Ticker from './src/Models/Ticker';
import TickerAPI from './src/DataSources/TickerAPI';

const {RedisCache} = require('apollo-server-cache-redis');

dotenv.config();

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
    scalar Date

    type Ticker {
        symbol : String!
        open: Float,
        high: Float,
        low: Float,
        current: Float,
        end: Date,
        previous_close: Float 
        history(start: String!, end: String!) : [Ticker],
        lastIntraday: [Ticker]
    }

    type Query {
        hello: String,
        ticker( symbol: String!) : Ticker
        tickers( symbols: [String]!) : [Ticker]
    }
`;

//TODO: Consider adding support for multiple sources if consuming from different APIs
//https://medium.com/@awesome1888/how-to-use-graphql-apollo-server-with-serverless-606430ad94b3

const resolvers = {
    Query: {
        ticker: (obj, {symbol}, context, info): Promise<Ticker> => {
            return context.dataSources.tickerAPI.fetchTicker(symbol)
        }
    },

    Ticker: {
        history: ({symbol}, {start, end}, context): Promise<Array<Ticker>> => context.dataSources.tickerAPI.fetchTickerHistory(symbol, start, end)
    },

    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value: any): ?Date {
            if (typeof value === String) {
                return new Date(value); // value from the client
            }
        },

        serialize(value: any): ?string {
            if (typeof value === Date) {
                return value.getTime();
            }
        },

        parseLiteral(ast: any): ?number {
            if (ast.kind === Kind.INT) {
                return parseInt(ast.value, 10); // ast value is always in string format
            }
        }
    }),
};

const userTickers = ['BYND', 'MA'];
const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: (): Object => {
        return {
            tickerAPI: new TickerAPI({
                cache: new RedisCache({
                    host: 'localhost'
                })
            })
        };
    },
    context: (): Object => {
        return {};
    },
});
const app = express();

server.applyMiddleware({app});

app.listen({port: 4000}, (): any =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
