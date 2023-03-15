import react from 'react';

import Image from 'next/image';
import styles from '../styles/Article.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Button,Modal } from 'antd';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBookmark, removeBookmark } from '../reducers/bookmarks';
import { hideArticle } from '../reducers/hiddenArticles';
import {UserState} from '../reducers/user';
import { getBackendAdress } from '@/modules/adress';




// Composant permettant l'affichage d'un article

type ArticleProps = {
	title: string;
	author: string;
	description : string;
  urlToImage : string;
  isBookmarked : boolean;
  inBookmarks : boolean;
};

export default function Article({title, author, description, urlToImage,isBookmarked,inBookmarks}: ArticleProps){

  const dispatch = useDispatch();
  const BACKENDADRESS:string = getBackendAdress();

  // état pour l'ouverture d'une modale si l'utilisateur essaye de bookmarker alors qu'il n'est pas connecté
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // récupération des données sur l'utilisateur : servira pour les autorisations pour les favoris
	const user = useSelector((state : {user : UserState}) => state.user.value);

  // récupération des données de l'articles via les props
  const theArticle = {title, author, description, urlToImage};

   // fonction gérant l'affichage de la modale de connexion/inscription
  const showModal = (visible : boolean) => {
    setIsModalVisible(visible);
  };

  // fonction gérant l'ajout ou la suppression des favoris
	const handleBookmarkClick = () => {
    // si pas d'utilisateur pas de favoris possible
		if (!user.token) {
      showModal(true)
			return;
		}

    // récupération de l'autorisation, puis ajout ou suppression des favoris
    async function getAuthorisation(){
      try{
        console.log()
        const response = await fetch(`${BACKENDADRESS}/users/canBookmark/${user.token}`);
        const data = await response.json();

        if (data.result && data.canBookmark) {
					if(isBookmarked) {
						dispatch(removeBookmark(theArticle));
					} else {
						dispatch(addBookmark(theArticle));
					}
				}

      }catch(exception){
          console.log("error",exception);
      }
    } 
		getAuthorisation();
	}


  // fonction gérant le cache ou l'affichage d'un article
	const handleHiddenClick = () => {
    dispatch(hideArticle(title));	
	}


  // couleur de l'icône selon si l'article appartient ou non aux favoris 
  let iconStyle = {};
  if (isBookmarked) {
    iconStyle = { 'color': '#E9BE59' };
  }

  // Affichage du composant
	return (	
		<div className={styles.articles}>
      <div className={styles.articleHeader}>
        <h3>{title}</h3>
        <FontAwesomeIcon onClick={() => handleBookmarkClick()} icon={faBookmark} style={iconStyle} className={styles.bookmarkIcon} />
        {inBookmarks || <FontAwesomeIcon icon={faEyeSlash} onClick={() => handleHiddenClick()} className={styles.hideIcon} />}
      </div>
      <h4 style={{ textAlign: "right" }}>- {author}</h4>
      <div className={styles.divider}></div>
      <Image src={urlToImage} alt={title} width={400} height={200} />
      <p>{description}</p>
      <Modal
            width = {"350px"} 
            open={isModalVisible} 
            closable={true} 
            onCancel={()=>showModal(false)} 
            footer={[<Button key="submit" type="primary"  onClick={()=>showModal(false)}>OK</Button>]}>
        You must be connected to have bookmarks
      </Modal>
    </div>
	);
}