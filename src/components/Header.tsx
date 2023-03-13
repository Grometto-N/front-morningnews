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


// composant gérant l'affichage du header

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

  // fonction gérant l'enregistrement d'un utilisateur en BDD puis mise à jour des données du reducer
  const handleRegister = () => {
    fetch(`${BACKENDADRESS}/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: signUpUsername, password: signUpPassword }),
    }).then(response => response.json())
      .then(data => {
        if (data.result) {
          dispatch(login({ username: signUpUsername, token: data.token }));
          setSignUpUsername('');
          setSignUpPassword('');
          setIsModalVisible(false)
        }
      });
  };

  // fonction gérant la connection d'un utilisateur, puis mise à jour des données du reducer
  const handleConnection = () => {
    fetch(`${BACKENDADRESS}/users/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: signInUsername, password: signInPassword }),
    }).then(response => response.json())
      .then(data => {
        if (data.result) {
          dispatch(login({ username: signInUsername, token: data.token }));
          setSignInUsername('');
          setSignInPassword('');
          setIsModalVisible(false)
        }
      });
  };

  // fonction gérant la déconexion de l'utilisateur : on efface les favoris et les données de l'utilisateur
  const handleLogout = () => {
    dispatch(logout());
    dispatch(removeAllBookmark());
  };

  // fonction gérant l'affichage de la modale de connexion/inscription
  const showModal = () => {
    setIsModalVisible(!isModalVisible);
  };


  // contenus de la modale
  let modalContent;
  if (!user.token) {
    modalContent = (
      <div className={styles.registerContainer}>
        <div className={styles.registerSection}>
          <p>Sign-up</p>
          <input type="text" placeholder="Username" id="signUpUsername" onChange={(e) => setSignUpUsername(e.target.value)} value={signUpUsername} />
          <input type="password" placeholder="Password" id="signUpPassword" onChange={(e) => setSignUpPassword(e.target.value)} value={signUpPassword} />
          <button id="register" onClick={() => handleRegister()}>Register</button>
        </div>
        <div className={styles.registerSection}>
          <p>Sign-in</p>
          <input type="text" placeholder="Username" id="signInUsername" onChange={(e) => setSignInUsername(e.target.value)} value={signInUsername} />
          <input type="password" placeholder="Password" id="signInPassword" onChange={(e) => setSignInPassword(e.target.value)} value={signInPassword} />
          <button id="connection" onClick={() => handleConnection()}>Connect</button>
        </div>
      </div>
    );
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
          <FontAwesomeIcon onClick={showModal} className={styles.userSection} icon={faXmark} />
          <FontAwesomeIcon icon={faEye} onClick={() => dispatch(unhideArticles())} className={styles.unhideIcon} />
        </div>
    } else {
      userSection =
        <div className={styles.headerIcons}>
          <FontAwesomeIcon onClick={showModal} className={styles.userSection} icon={faUser} />
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
          <Modal getContainer="#react-modals" className={styles.modal} visible={isModalVisible} closable={false} footer={null}>
            {modalContent}
          </Modal>
        </div>}
    </header >
  );
}
