import Vue from 'vue'
import App from './App.vue'
import firebase from 'firebase/app';
import 'firebase/analytics';

var firebaseConfig = {
  apiKey: "AIzaSyDXjjpDKxVEKxF1YbE2Bc7OvOYEYb6AHJc",
  authDomain: "physics-2048.firebaseapp.com",
  projectId: "physics-2048",
  storageBucket: "physics-2048.appspot.com",
  messagingSenderId: "526814158756",
  appId: "1:526814158756:web:df7f08432d9da85120ab31",
  measurementId: "G-LSD6TN3RNP",
  databaseURL: "https://physics-2048-default-rtdb.europe-west1.firebasedatabase.app"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

Vue.config.productionTip = false

document.title = "Физический 2048"

new Vue({
  render: h => h(App)
}).$mount('#app')
