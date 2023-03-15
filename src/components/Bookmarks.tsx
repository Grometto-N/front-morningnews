import React, { FC } from 'react';
import styles from '../styles/Bookmarks.module.css';

import Head from 'next/head';
import Article from './Article';

import { useSelector } from 'react-redux';
import {BookmarksState} from '../reducers/bookmarks';

import { ArticleObject } from '@/modules/types';
// Composant à afficher dans la page bookmarks : affiche tous les articles cochés favoris


export default function Bookmarks() {
  // récupération des articles à afficher via le reducer correspondant
  const bookmarks = useSelector((state:{bookmarks:BookmarksState}) => state.bookmarks.value);

 // gestion de l'affichage : vérifier seulement s'il y a des articles dans les favoris
  let articles:any = <p>No article</p>;
  if (bookmarks.length > 0) {
    articles = bookmarks.map((data:ArticleObject, i:number) => {
      return <Article key={i} inBookmarks={true} {...data} isBookmarked />;
    });
  }

  // Affichage du composant
  return (
    <div>
      <Head>
        <title>Morning News - Bookmarks</title>
      </Head>
      <div className={styles.container}>
        <h2 className={styles.title}>Bookmarks</h2>
        <div className={styles.articlesContainer}>
          {articles}
        </div>
      </div>
    </div>
  );
}

