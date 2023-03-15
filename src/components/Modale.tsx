import styles from '../styles/Modale.module.css';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login} from '../reducers/user';
import { getBackendAdress } from '@/modules/adress';

// type function pour la props d'affichage de la modale (inverse data flow)
interface ShowProps {
    showModal: (visible: boolean) => void;
}

export default function Modale({showModal}:ShowProps){

    const dispatch = useDispatch();
    const BACKENDADRESS:string = getBackendAdress();

    // états gérant les différents inputs
    const [signUpUsername, setSignUpUsername] = useState<string>('');
    const [signUpPassword, setSignUpPassword] = useState<string>('');
    const [signInUsername, setSignInUsername] = useState<string>('');
    const [signInPassword, setSignInPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    // variable gérant l'affichage d'un message d'erreur en bas de la modale

    // fonction gérant l'enregistrement d'un utilisateur en BDD puis mise à jour des données du reducer
    const handleRegister = () => {
        async function registration(){
            try{
                const response = await fetch(`${BACKENDADRESS}/users/signup`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ username: signUpUsername, password: signUpPassword }),
                                })
                const data = await response.json();
        
                if (data.result) {
                    dispatch(login({ username: signUpUsername, token: data.token }));
                    setSignUpUsername('');
                    setSignUpPassword('');
                    showModal(false);
                }

                if(!data.result){
                    setErrorMessage(data.error);
                }

            }catch(exception){
                console.log("erreur", exception)
            }
        }
        registration();
    };

  // fonction gérant la connection d'un utilisateur, puis mise à jour des données du reducer
    const handleConnection = () => {
        async function connection(){
            try{
                const response = await fetch(`${BACKENDADRESS}/users/signin`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username: signInUsername, password: signInPassword }),
                            });
                const data = await response.json();
        
                if (data.result) {
                    dispatch(login({ username: signInUsername, token: data.token }));
                    setSignInUsername('');
                    setSignInPassword('');
                    showModal(false);
                }

                if(!data.result){
                    setErrorMessage(data.error);
                }

            }catch(exception){
                console.log("erreur", exception)
            }
        }
        connection();
    };




    // Affichage du composant
	return (<div className={styles.container}>
    <div className={styles.registerContainer}>
        <div className={styles.registerSection}>
            {/* SIGN UP */}
            <p>Sign-up</p>
            <input type="text" placeholder="Username" id="signUpUsername" onChange={(e) => setSignUpUsername(e.target.value)} value={signUpUsername} />
            <input type="password" placeholder="Password" id="signUpPassword" onChange={(e) => setSignUpPassword(e.target.value)} value={signUpPassword} />
            <button id="register" onClick={() => handleRegister()}>Register</button>
            </div>
        <div className={styles.registerSection}>
            {/* SIGN IN */}
            <p>Sign-in</p>
            <input type="text" placeholder="Username" id="signInUsername" onChange={(e) => setSignInUsername(e.target.value)} value={signInUsername} />
            <input type="password" placeholder="Password" id="signInPassword" onChange={(e) => setSignInPassword(e.target.value)} value={signInPassword} />
            <button id="connection" onClick={() => handleConnection()}>Connect</button>
        </div>
    </div>
    {/* Message d'erreur */}
    {errorMessage && <p className={styles.message} >{errorMessage}</p>}
    </div>
    );    
}