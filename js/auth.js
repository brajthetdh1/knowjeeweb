// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBD4Dmwjl_BUUUIBGYjMKfaBqdVxiH2qqg",
  authDomain: "knowjee-1d295.firebaseapp.com",
  projectId: "knowjee-1d295",
  storageBucket: "knowjee-1d295.firebasestorage.app",
  messagingSenderId: "45926699651",
  appId: "1:45926699651:web:0e8af54278c2d0e60c01b6",
  measurementId: "G-HSXHCRNTR1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.currentUser = null;
window.userData = null;
window.userIsPaid = false;

// Register function
window.registerUser = async function(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: email,
      isPaid: false,
      topicsViewed: [],
      quizzesSolved: []
    });
    alert("Registered successfully!");
  } catch (err) {
    alert(err.message);
  }
};

// Login function
window.loginUser = async function(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Logged in!");
  } catch (err) {
    alert(err.message);
  }
};

// Logout function
window.logoutUser = async function() {
  await signOut(auth);
  alert("Logged out!");
};

// Auth state listener
onAuthStateChanged(auth, async (user) => {
  if (user) {
    window.currentUser = user;
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    window.userData = docSnap.exists() ? docSnap.data() : null;
    userIsPaid = docSnap.exists()?docSnap.data().isPaid:false;
    document.dispatchEvent(new Event('firebaseAuthUpdated'));
  } else {
    window.currentUser = null;
    window.userData = null;
    document.dispatchEvent(new Event('firebaseAuthUpdated'));
  }
});
