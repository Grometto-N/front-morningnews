import react from 'react';
import styles from '../styles/TopArticle.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { Button,Modal } from 'antd';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBookmark, removeBookmark } from '../reducers/bookmarks';
import { UserState } from '@/reducers/user';

import { getBackendAdress } from '@/modules/adress';

// types perso
import { ArticleObject, ArticleProps } from '@/modules/types';


export default function TopArticle({title, author, description, urlToImage,  isBookmarked}: ArticleProps) {
  const dispatch = useDispatch();
  const BACKENDADRESS:string = getBackendAdress();

   // récupération des données sur l'utilisateur : servira pour les autorisations pour les favoris
  const user = useSelector((state:{user:UserState}) => state.user.value);
  const theArticle:ArticleObject = {title, author, description, urlToImage}

  // état pour l'ouverture d'une modale si l'utilisateur essaye de bookmarker alors qu'il n'est pas connecté
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // fonction gérant l'affichage de la modale de connexion/inscription
  const showModal = (visible : boolean) => {
    setIsModalVisible(visible);
  };

  // fonction gérant l'ajout ou la suppression des favoris
  const handleBookmarkClick = () => {
    if (!user.token) {
      showModal(true)
      return;
    }

    // récupération de l'autorisation, puis ajout ou suppression des favoris
    async function getAuthorisation(){
      try{
        const response = await fetch(`${BACKENDADRESS}/canBookmark`,{
          method: 'GET',
          headers: { 'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + user.token 
                    },
        });
        const data = await response.json();

        if (data.result) {
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

  // couleur de l'icône selon si l'article appartient ou non aux favoris 
  let iconStyle = {};
  if (isBookmarked) {
    iconStyle = { 'color': '#E9BE59' };
  }

  // Affichage du composant
  return (
    <div className={styles.topContainer}>
      <img src={urlToImage} className={styles.image} alt={title} />
      <div className={styles.topText}>
        <h2 className={styles.topTitle}>{title}</h2>
        <FontAwesomeIcon onClick={() => handleBookmarkClick()} icon={faBookmark} style={iconStyle} className={styles.bookmarkIcon} />
        <h4>{author}</h4>
        <p>{description}</p>
      </div>
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
