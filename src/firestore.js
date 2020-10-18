import firebase from "firebase";

var firebaseConfig = {
    apiKey: "AIzaSyBS2qP0NWd1LovzYLxVpzOxpCG599duDPw",
    authDomain: "todo-e129c.firebaseapp.com",
    databaseURL: "https://todo-e129c.firebaseio.com",
    projectId: "todo-e129c",
    storageBucket: "todo-e129c.appspot.com",
    messagingSenderId: "43902305729",
    appId: "1:43902305729:web:bd825ddbff2fabf558db40",
    measurementId: "G-L3F5LYQ0W5"
};

export default firebase.initializeApp(firebaseConfig);