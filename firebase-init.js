// AG CARS KARIMNAGAR — Firebase setup, shared by the customer page and admin page.
// This apiKey is safe to be public — real protection is the security rules in Firebase,
// not secrecy of this config.
const firebaseConfig = {
  apiKey: "AIzaSyBS31DWrYuClPRKFgL075YtzrurG2KFe1o",
  authDomain: "ag-cars-karimnagar.firebaseapp.com",
  projectId: "ag-cars-karimnagar",
  storageBucket: "ag-cars-karimnagar.firebasestorage.app",
  messagingSenderId: "816885723607",
  appId: "1:816885723607:web:b9ed7452cbb5aa669e1b92"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
