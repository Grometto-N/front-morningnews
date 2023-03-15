// composant principal

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Article from './Article';
import TopArticle from './TopArticle';
import styles from '../styles/Home.module.css';

import { HidenArticleState } from '../reducers/hiddenArticles';
import { BookmarksState } from '../reducers/bookmarks';

import { getBackendAdress } from '@/modules/adress';

// type(s) perso
import { ArticleObject } from '@/modules/types';

export default function Home() {
  const BACKENDADRESS:string = getBackendAdress();

  // données des reducers : favoris et articles cachés
  const bookmarks = useSelector((state : {bookmarks : BookmarksState }) => state.bookmarks.value);
  const hiddenArticles = useSelector((state : {hiddenArticles : HidenArticleState}) => state.hiddenArticles.value);

  // initialisation des états : un tableau d'article et un pour l'article de tête
  const [articlesData, setArticlesData] = useState<ArticleObject[]>([]);
  const [topArticle, setTopArticle] = useState<ArticleObject>({title: "",
                                                              author: "",
                                                              description : "",
                                                              urlToImage: "" });

  // récupération des données au chargement

  useEffect(() => {
    async function getArticles(){
      try{
        const response = await fetch(`${BACKENDADRESS}/articles`);
        const data = await response.json();

        setTopArticle(data.articles[0]);
        setArticlesData(data.articles.filter((data:ArticleObject, i:number) => i > 0));


      }catch(exception){
        console.log("error", exception);
      }
    }
    getArticles();
  }, []);


  // gestion de laffichage des articles : articles masques (reducer hiddenArticles) et des favoris (reducer bookmarks)
  const filteredArticles = articlesData.filter((data:ArticleObject) => !hiddenArticles.includes(data.title));
  const displayArticles = filteredArticles.map((data:ArticleObject, i:number) => {
    const isBookmarked = bookmarks.some(bookmark => bookmark.title === data.title);
    return <Article key={i} {...data} isBookmarked={isBookmarked} inBookmarks={false}/>;
  });

  // gestion de l'affichage de l'article du sommet
  let displayTopArticles;
  if (bookmarks.some(bookmark => bookmark.title === topArticle.title)) {
    displayTopArticles = <TopArticle {...topArticle} isBookmarked={true} inBookmarks={false}/>
  } else {
    displayTopArticles = <TopArticle {...topArticle} isBookmarked={false} inBookmarks={false}/>
  }

  // Affichage du composant
  return (
    <div>
      {displayTopArticles}
      <div className={styles.articlesContainer}>
        {displayArticles}
      </div> 
    </div>
  );
}


