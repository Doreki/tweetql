import { ApolloServer,gql } from "apollo-server";

let tweets = [
  {
    id:"1",
    text:"first one",
    userId:"2",
  },
  {
    id:"2",
    text:"seconde one",
    userId:"1",
  }
];

let users = [
  {
  id:"1",
  firstName:"Nico",
  lastName:"las"
  },{
    id:"2",
    firstName:"Elon",
    lastName:"mask"
  }
]
const typeDefs = gql`
      type User {
        id:ID!
        username: String!
        firstName: String!
        lastName: String!
        fullName: String!
      }
"""
 Tweet object represents a resource for a Tweet
"""
    type Tweet {
      id:ID!
      text:String!
      author: User
    }
  type Query {
    allUsers:[User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }
  type Mutation {
    postTweet(text:String!, userId: ID!): Tweet!
    deleteTweet(id:ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(root, {id}) {
      return tweets.find(tweet => tweet.id === id);
    },
    allUsers(){
      return users;
    }
  },
  Mutation: {
    postTweet(_, {text,userId}) {
      const newTweet = {
        id:tweets.length +1,
        text,
        userId
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, {id}) {
      const tweet = tweets.find(tweet => tweet.id === id);
      if(!tweet) return false;
      tweets.filter(tweet => tweet.id !== id);
      return true;
    }
  },
  User: {
    firstName({firstName}){
      return "firstName";
    },
    fullName({firstName,lastName}) {
      return `${firstName} ${lastName}`;
    }
  },
  Tweet:{
    author({userId}){
      if(!users.find(userId))
        throw new Error("Id가 존재하지 않습니다.");
      return users.find(user => user.id === userId);
    }
  }
}
const server = new ApolloServer({typeDefs,resolvers})

server.listen().then(({url}) => {
  console.log(`Running on ${url}`);
});

