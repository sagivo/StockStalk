const firebase = window.firebase;
const config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
};

firebase.initializeApp(config);
const db = firebase.firestore();
const auth = firebase.auth();

export { auth, db }