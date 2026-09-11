// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDBwTCf5ZYW8SRTfkF1HU7W1Z_xWOr-l4Q",
  authDomain: "agentek-3a8c2.firebaseapp.com",
  projectId: "agentek-3a8c2",
  storageBucket: "agentek-3a8c2.firebasestorage.app",
  messagingSenderId: "1061814679082",
  appId: "1:1061814679082:web:e9dfe2db2f5870ed687553",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);