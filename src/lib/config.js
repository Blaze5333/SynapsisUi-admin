import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore"
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "synapsisui-admin.firebaseapp.com",
  projectId: "synapsisui-admin",
  storageBucket: "synapsisui-admin.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_API_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const storage=getStorage(app)
 const db=getFirestore(app)
export {app,storage,db}
