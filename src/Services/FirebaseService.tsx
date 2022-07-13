import { initializeApp } from "firebase/app";
import {GoogleAuthProvider,getAuth,signInWithPopup,signInWithEmailAndPassword,createUserWithEmailAndPassword,sendPasswordResetEmail,signOut,} from "firebase/auth";
import { FirebaseApp } from "firebase/app";
import CardModel from "../Models/CardModel";
import { getFirestore, doc, query, collection, where, getDocs, addDoc, setDoc, getDoc, DocumentData } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import DeckModel from "../Models/DeckModel";
import CardFromFirebaseModel from "../Models/CardFromFirebaseModel";
import CardService from "./CardService";
import { v4 as uuidv4 } from 'uuid';
 
const firebaseConfig = {
    apiKey: "AIzaSyAzb25HokiX-JU_K9I_zzoHXUrO6y2niZs",
    authDomain: "magic-app-34e1f.firebaseapp.com",
    projectId: "magic-app-34e1f",
    storageBucket: "magic-app-34e1f.appspot.com",
    messagingSenderId: "610775773595",
    appId: "1:610775773595:web:45fefbacf01932742c313e",
    measurementId: "G-LXEP308J1Y"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const cardService: CardService = new CardService()

const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
        await addDoc(collection(db, "users"), {
            uid: user.uid,
            name: user.displayName,
            authProvider: "google",
            email: user.email,
        });
        }
    } catch (err) {
        console.error(err);
    }
};
const logInWithEmailAndPassword = async (email: string, password: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        console.error(err);
    }
};
const registerWithEmailAndPassword = async (name: string, email: string, password: string) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
        });
    } catch (err) {
        console.error(err);
    }
};
const sendPasswordReset = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset link sent!");
    } catch (err) {
        console.error(err);
    }
};
const logout = () => {
    signOut(auth);
};

const addUserToFirestore = async (user: any) => {
    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, {
        uid: user.uid,
    });
}

const addCardToCollection = async (card: CardModel, user: any) => {
    const userCollection = collection(db, 'users/' + user.uid + '/cards');

    await addDoc(userCollection, cardService.CardtoCardCardFromFirebaseModel(card));
}

const addCardToDeck = async (card: CardModel, user: any, deck: string) => {
    const deckCollection = collection(db, 'users/' + user.uid + '/decks/' + deck + "/cards");

    await addDoc(deckCollection, cardService.CardtoCardCardFromFirebaseModel(card));
}

const getCardCollection = async (user: any) => {
    const mySnapshot = await getDocs(collection(db, 'users/' + user.uid + '/cards'));
    const cardList: DocumentData[] = [];
    mySnapshot.forEach((myDoc) => {
        cardList.push(myDoc.data());
      });
    return cardList;
}

const createDeck = async (deckName: string, user: any) => {
    const docRef = doc(db, "users", user.uid + '/decks/' + deckName);
    await setDoc(docRef, {
        name: deckName,
        id: uuidv4()
    });
}

const getDecks = async (user: any) => {
    const mySnapshot = await getDocs(collection(db, 'users/' + user.uid + '/decks'));
    const deckList: DocumentData[] = [];
    mySnapshot.forEach((myDoc) => {
        deckList.push(myDoc.data());
    });
    return deckList;
}

const getDeck = async (user: any, deck: string) => {
    const mySnapshot = await getDocs(collection(db, 'users/' + user.uid + '/decks'));
    const cardsSnapshot = await getDocs(collection(db, 'users/' + user.uid + '/decks/' + deck + '/cards'));
    const deckObject: DeckModel = {
        name: "",
        cards: [],
        id: ""
    };
    const cardObject: CardFromFirebaseModel[] = [];
    
    mySnapshot.forEach((myDoc) => {
        if (myDoc.data().name === deck) {
            deckObject.name = myDoc.data().name;
            deckObject.id = myDoc.data().id;
            cardsSnapshot.forEach((card) => {
                cardObject.push(cardService.DocumentToCardFromFirebaseModel(card));
            }); 
            deckObject.cards = cardObject;
        }
    });
    return deckObject;
}

const getSharedDeck = async (deckId: string) => {
    const mySnapshot = await getDocs(collection(db, 'users/'));

    const deckObject: DeckModel = {
        name: "",
        cards: [],
        id: ""
    };
    const cardObject: CardFromFirebaseModel[] = [];

    await mySnapshot.forEach(async (myDoc) => {
        await getDocs(collection(db, 'users/', myDoc.data().uid, "/decks")).then((snapshot) => {
            snapshot.forEach(async (deck) => {
                if(deck.data().id == deckId){
                    await getDocs(collection(db, 'users/' + myDoc.data().uid + '/decks/' + deck.data().name + '/cards')).then((cardSnapshot) => {
                    deckObject.name = deck.data().name;
                    deckObject.id = deck.data().id;
                    cardSnapshot.forEach(async (card) => {
                        cardObject.push(cardService.DocumentToCardFromFirebaseModel(card));
                    }); 
                    deckObject.cards = cardObject;
                    });
                }   
            });
        });
    });

    return deckObject;
}

const getShareUrl  = async (deckName: string, user: any) => {
    const snapshot = await getDocs(collection(db, 'users/' + user.uid+ '/decks/' + deckName));
    return snapshot.forEach((doc) => {
        return "http://localhost:3000/sharedDeck/" + doc.data().id;
    });
}

export {
    auth,
    db,
    signInWithGoogle,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
    addUserToFirestore,
    addCardToCollection,
    getCardCollection,
    createDeck,
    getDecks,
    getDeck,
    addCardToDeck,
    getSharedDeck,
    getShareUrl
};

