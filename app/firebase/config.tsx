// import { initializeApp } from "firebase/app";
// import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
// import { createContext, useContext, ReactNode } from "react";
// import { getDatabase, set} from "firebase/database";
// import { getFirestore } from "firebase/firestore";
// import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
// import multer from "multer";
// // Define the shape of the context value
// interface FirebaseContextType {
//   signupwithemailandpassword: (email: string, password: string) => Promise<void>;
//   putdata: (data: any, key: string) => Promise<void>;
// }
// const storage = getStorage();
// const upload = multer({ storage: multer.memoryStorage() });
// router.post("/", upload.single("filename"), async (req, res) => {
//     try {
//         const dateTime = giveCurrentDateTime();

//         const storageRef = ref(storage, `files/${req.file.originalname + "       " + dateTime}`);

//         // Create file metadata including the content type
//         const metadata = {
//             contentType: req.file.mimetype,
//         };

//         // Upload the file in the bucket storage
//         const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
//         //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

//         // Grab the public url
//         const downloadURL = await getDownloadURL(snapshot.ref);

//         console.log('File successfully uploaded.');
//         return res.send({
//             message: 'file uploaded to firebase storage',
//             name: req.file.originalname,
//             type: req.file.mimetype,
//             downloadURL: downloadURL
//         })
//     } catch (error) {
//         return res.status(400).send(error.message)
//     }
// });
// // Create context with the correct type
// const FireBaseContext = createContext<FirebaseContextType | null>(null);

// // Custom hook to use the Firebase context
// export const useFirebase = () => {
//   const context = useContext(FireBaseContext);
//   if (!context) {
//     throw new Error("useFirebase must be used within a FirebaseProvider");
//   }
//   return context;
// };

// // Define the type for the provider props
// interface FirebaseProviderProps {
//   children: ReactNode;
// }

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
//   measurementId: process.env.REACT_APP_MEASUREMENT_ID,
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const FireBaseAuth = getAuth(app);
// const database = getDatabase(app);
// const db = getFirestore(app);

// // FirebaseProvider component
// export const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
//   const signupwithemailandpassword = async (email: string, password: string): Promise<void> => {
//     await createUserWithEmailAndPassword(FireBaseAuth, email, password);
//   };

//   const putdata = async (data: any, key: string): Promise<void> => {
//     await set(ref(database, key), data);
//   };

//   return (
//     <FireBaseContext.Provider value={{ signupwithemailandpassword, putdata }}>
//       {children}
//     </FireBaseContext.Provider>
//   );
// };

// export default app;
