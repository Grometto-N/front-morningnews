import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head';

import Header from '../components/Header'

import { Provider } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import bookmarks from '../reducers/bookmarks';
import user from '../reducers/user';
import hiddenArticles from '../reducers/hiddenArticles';

import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage';

const reducers = combineReducers({  bookmarks, user , hiddenArticles });
const persistConfig = { key: 'morningnews', storage };

const store = configureStore({
    reducer: persistReducer(persistConfig, reducers),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  });

  const persistor = persistStore(store);

export default function App({ Component, pageProps }: AppProps) {
  return <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Head>
            <title>Morning News</title>
          </Head>
        <Header />
        <Component {...pageProps} />
        </PersistGate>
        </Provider>
}
