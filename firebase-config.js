// firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAXofkSy3vfz7GuTgj6-S-rK2rsnUQp_J0",
  authDomain: "ai-playground-ratings.firebaseapp.com",
  projectId: "ai-playground-ratings",
  storageBucket: "ai-playground-ratings.firebasestorage.app",
  messagingSenderId: "112573912701",
  appId: "1:112573912701:web:b381d9c41871025f49c314",
  measurementId: "G-8LJN7YJZMS"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
