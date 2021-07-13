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


/*
const firebaseConfig = {
  apiKey: "AIzaSyBwGvKd9B0SmRa_KvVhJvgVO1P3ozicAEU",
  authDomain: "testes-2eb48.firebaseapp.com",
  databaseURL: "https://testes-2eb48.firebaseio.com",
  projectId: "testes-2eb48",
  storageBucket: "testes-2eb48.appspot.com",
  messagingSenderId: "491311724969",
  appId: "1:491311724969:web:e3a2d388d48436d4adecb8"
};
*/


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
  db
};

export default firebase;