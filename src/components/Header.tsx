// composant gérant l'affichage du header
import react from 'react';
import styles from '../styles/Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faXmark, faEye } from '@fortawesome/free-solid-svg-icons';

import { Modal } from 'antd';
import Link from 'next/link';
import Moment from 'react-moment';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { login, logout } from '../reducers/user';
import { removeAllBookmark } from '../reducers/bookmarks';
import { unhideArticles } from '../reducers/hiddenArticles';
import { UserState } from '../reducers/user';
import { getBackendAdress } from '@/modules/adress';

import Modale from './Modale';


// définition du composant
export default function Header() {
  const dispatch = useDispatch();
  
const BACKENDADRESS:string = getBackendAdress();

  // récupération des données sur l'utilisateur pour afficher un message avec le nom
  const user = useSelector((state:{user:UserState}) => state.user.value);

  // initialisation des états : un pour la date, un pour l'enregistrement d'un utilisateur et un pour la connexion d'un utilisateur
  const [date, setDate] = useState<Date>();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [signUpUsername, setSignUpUsername] = useState<string>('');
  const [signUpPassword, setSignUpPassword] = useState<string>('');
  const [signInUsername, setSignInUsername] = useState<string>('');
  const [signInPassword, setSignInPassword] = useState<string>('');


  // récupération de la date du jour au chargement
  useEffect(() => {
    setDate(new Date());
  }, []);


  // fonction gérant la déconexion de l'utilisateur : on efface les favoris et les données de l'utilisateur
  const handleLogout = () => {
    dispatch(logout());
    dispatch(removeAllBookmark());
  };

  // fonction gérant l'affichage de la modale de connexion/inscription
  const showModal = (visible : boolean) => {
    setIsModalVisible(visible);
  };


  // contenus de la modale
  let modalContent;
  if (!user.token) {
    modalContent=<Modale visible= {showModal}/>
  }


  // gestion de l'affichage  de la partie avec le nom d'utilisateur ou avec le bouton de connexion ou  bouton de fermeture de la modale
  let userSection;
  if (user.token) {
    userSection = (
      <div className={styles.logoutSection}>
        <p>Welcome {user.username} / </p>
        <button onClick={() => handleLogout()}>Logout</button>
        <FontAwesomeIcon icon={faEye} onClick={() => dispatch(unhideArticles())} className={styles.unhideIcon} />
      </div>
    );
  }else{
    if (isModalVisible) {
      userSection =
        <div className={styles.headerIcons}>
          {/* <FontAwesomeIcon onClick={showModal} className={styles.userSection} icon={faXmark} /> */}
          <FontAwesomeIcon icon={faEye} onClick={() => dispatch(unhideArticles())} className={styles.unhideIcon} />
        </div>
    } else {
      userSection =
        <div className={styles.headerIcons}>
          <FontAwesomeIcon onClick={() =>showModal(true)} className={styles.userSection} icon={faUser} /> 
          <FontAwesomeIcon icon={faEye} onClick={() => dispatch(unhideArticles())} className={styles.unhideIcon} />
        </div>
    }
  }

// affichage du composant
return (
    <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Moment className={styles.date} date={date} format="MMM Do YYYY" />
          <h1 className={styles.title}>Morning News</h1>
          {userSection}
        </div>
        
        <div className={styles.linkContainer}>
                <Link href="/"><span className={styles.link}>Articles</span></Link>
          <Link href="/bookmarks"><span className={styles.link}>Bookmarks</span></Link>
        </div>

        {isModalVisible && <div id="react-modals">
          <Modal className={styles.modal} open={isModalVisible} closable={true} onCancel={()=>showModal(false)} footer={null}>
            {modalContent}
          </Modal>
        </div>}
    </header >
  );
}
