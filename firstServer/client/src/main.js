import { createApp, provide, h } from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store"
import mitt from 'mitt';
import { DefaultApolloClient } from '@vue/apollo-composable'
import {ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'


const httpLink = createHttpLink({
  uri: 'http://localhost:8000/graphql',
})

const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})

const emitter = mitt();

const app = createApp({
  setup () {
    provide(DefaultApolloClient, apolloClient)
  },

  render: () => h(App),
})

app.config.globalProperties.emitter = emitter

app.use(router).use(store).mount('#app')
export default apolloClient;




