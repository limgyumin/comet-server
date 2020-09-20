import "dotenv/config";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import nodeFetch from "node-fetch";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.github.com/graphql",
    fetch: nodeFetch,
    headers: {
      authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  }),
  cache: new InMemoryCache(),
});

export default client;
