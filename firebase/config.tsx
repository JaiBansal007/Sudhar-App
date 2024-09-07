import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { createContext, useContext, ReactNode } from "react";
import { getDatabase, ref, set } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import 'firebase/firestore'; // For Firestore
// Define the shape of the context value
interface FirebaseContextType {
  signupwithemailandpassword: (email: string, password: string) => Promise<void>;
  putdata: (data: any, key: string) => Promise<void>;
}

const firebaseConfig = {
  apiKey:"AIzaSyDG9dSuxoI45AJ7STr5xALYREKFYf-vOMM",
  authDomain: "sudhar-app-a03f9.firebaseapp.com",
  projectId: "sudhar-app-a03f9",
  storageBucket:"sudhar-app-a03f9.appspot.com",
  messagingSenderId: "4677273521",
  appId:"1:4677273521:web:a09ce08ab9821d50851f90",
  measurementId: "G-P9E8WTCJBK",
};


// Create context with the correct type
const FireBaseContext = createContext<FirebaseContextType | null>(null);

// Custom hook to use the Firebase context
export const useFirebase = () => {
  const context = useContext(FireBaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth();
export const database = getDatabase();
export const db = getFirestore(app);
// FirebaseProvider to wrap around components
interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
  // Function to handle signup with email and password
  const signupwithemailandpassword = async (email: string, password: string): Promise<void> => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("User signed up successfully");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  // Function to write data to Firebase Realtime Database
  const putdata = async (data: any, key: string): Promise<void> => {
    try {
      await set(ref(database, key), data);
      console.log("Data saved successfully");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // Providing the functions through context
  return (
    <FireBaseContext.Provider value={{ signupwithemailandpassword, putdata }}>
      {children}
    </FireBaseContext.Provider>
  );
};

export default app;
