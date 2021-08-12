import firebase from 'firebase/app';
import 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyBLoS80wwL8rXXx_LVCaS2lfkGMnpx3xzE",
  authDomain: "eletronics-sentiment-analysis.firebaseapp.com",
  databaseURL: "https://eletronics-sentiment-analysis-default-rtdb.firebaseio.com",
  projectId: "eletronics-sentiment-analysis",
  storageBucket: "eletronics-sentiment-analysis.appspot.com",
  messagingSenderId: "347286621701",
  appId: "1:347286621701:web:394158e472c414d503d66c",
  measurementId: "G-C6VWW0LKDG"
};


firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

//.collection("/store_map")

const getAll = (collection) => {
  return db.collection(collection);
};

const getDoc = (collection,doc) => {
  return db.collection(collection).doc(doc);
};

const create = (collection,data) => {
  return db.collection(collection).add(data);
};

const createDoc = (collection,data,doc) => {
  return db.collection(collection).doc(doc).set(data);
};

const update = (collection,id, value) => {
  return db.collection(collection).doc(id).update(value);
};


const remove = (collection,id) => {
  return db.collection(collection).doc(id).delete();
};

const getUser = (collection) => {
  return firebase.auth().currentUser;
}

export const FirestoreService = {
  getAll,
  create,
  update,
  remove,
  getUser,
  createDoc,
  getDoc,
  db,
  firebase
};

export default firebase;
