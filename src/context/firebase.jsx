
import { initializeApp } from "firebase/app";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut
} from "firebase/auth";

import { getFirestore, collection, addDoc, doc, getDocs, getDoc, query, where, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const firestore = getFirestore(firebaseApp);

const auth = getAuth(firebaseApp);

//google Auth provider
const provider = new GoogleAuthProvider();

//create a context
const FirebaseContext = createContext(null);

// Cloudinary configuration
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

//custom hooks
export const useFirebase = () => {
    return useContext(FirebaseContext)
}

//create a context-provider
export const FirebaseContextProvider = (props) => {

    const [user, setUser] = useState(null)

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user) {
                setUser(user)
            }
            else {
                setUser(null)
            }
        })
    }, [])

    // Function to upload image to Cloudinary
    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                formData
            );
            return response.data.secure_url;
        } catch (error) {
            console.error("Error uploading image to Cloudinary:", error);
            throw error;
        }
    };

    //function to create a email and password

    const signUpWithEmailAndPassword = async (fullname, username, age, email, password, profileImage) => {
        try {
            let imageUrl = null;
            if (profileImage) {
                imageUrl = await uploadImage(profileImage); // image upload hua
            }

            // email aur password firebase auth me daal
            const emailAndPasswordUser = await createUserWithEmailAndPassword(auth, email, password);
            const user = emailAndPasswordUser.user;

            // add kar extra details in Firestore users collection
            await setDoc(doc(firestore, 'users', user.uid), {
                uid: user.uid,
                fullName: fullname,
                username: username,
                age: age,
                email: email,
                profilePicUrl: imageUrl || null,
                createdAt: new Date()
            });

            console.log("User created and details saved!");
            return user;
        } catch (error) {
            console.log("Error Occurred at signUpWithEmailAndPassword", error);
            throw error;
        }
    }

    //function to retrieve data from document for profile page
    const UserData = async (userId) => {
        const docRef = doc(firestore, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("User Data: ", docSnap.data());
            return docSnap.data();
        } else {
            console.log("Data is not present!!");
            return null;
        }
    }
    //function to sign in user with email and password
    const signInUser = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    //function to signin with google
    const signInWithGoogle = () => {
        return signInWithPopup(auth, provider)
    }

    //function to logout the user
    const logoutUser = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            throw new Error("Error during logout: ", error);
        }
    }

    const isLoggedIn = user ? true : false;
    // console.log(user)


    //function to create a list and put it into cloud firestore
    const handleCreateNewListing = async (name, isbnNumber, price, coverPic) => {
        try {
            let imageUrl = null;
            if (coverPic) {
                imageUrl = await uploadImage(coverPic);
            }
            const docRef = await addDoc(collection(firestore, "List"), {
                name: name,
                isbnNumber: isbnNumber,
                price: price,
                coverPicUrl: imageUrl,
                userId: user.uid,
                userEmail: user.email,
                displayName: user.displayName,
                createdAt: new Date()
            })
            return docRef;
        }
        catch (err) {
            console.log("Error Occurred at function handleCreateNewListing ", err);
            throw err;
        }
    }

    //function to retrieve collections from firebase 
    const readData = async () => {
        const collectionRef = collection(firestore, 'List');
        const querySnapshot = await getDocs(collectionRef);
        const docs = [];
        querySnapshot.forEach(doc => {
            docs.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return docs;
    }

    //function to retrieve each document using Id
    const showEachBookDetail = async (id) => {
        const docRef = doc(firestore, `List/${id}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        else {
            console.log("Data is Not Present")
        }
    }

    //function to place Order for books
    const placeOrder = async (bookId, imageUrl, qty) => {

        try {
            const collectionRef = collection(firestore, `List/${bookId}/orders`);
            const result = await addDoc(collectionRef, {
                userId: user.uid,
                userEmail: user.email,
                coverPicUrl: imageUrl,
                createdAt: new Date(),
                quantity: qty,
            })
            console.log("Order placed successfully!", result.id);
            return result.id;
        }
        catch (error) {
            console.error("Error placing order: ", error);
        }
    }

    //function to fetch Orders of particular user
    const fetchMyOrders = async () => {
        try {
            if (!user) {
                throw new Error("User not authenticated");
            }

            const booksSnapshot = await getDocs(collection(firestore, "List"));

            const orderPromises = booksSnapshot.docs.map(async (bookDoc) => {
                const ordersRef = collection(firestore, `List/${bookDoc.id}/orders`);
                const q = query(ordersRef, where("userId", "==", user.uid));
                const ordersSnapshot = await getDocs(q);

                return ordersSnapshot.docs.map(orderDoc => ({
                    id: orderDoc.id,
                    bookId: bookDoc.id,
                    ...orderDoc.data(),
                    bookDetails: bookDoc.data(), // Book ke details bhi la rahe hain
                }));
            });

            // Wait for all orders from all books
            const ordersArray = await Promise.all(orderPromises);

            // ordersArray is an array of arrays, so we flatten it
            const allOrders = ordersArray.flat();

            return allOrders;

        } catch (error) {
            console.error("Error fetching orders: ", error);
            return [];
        }
    };

    return (
        <FirebaseContext.Provider value={{
            signUpWithEmailAndPassword,
            signInUser,
            signInWithGoogle,
            handleCreateNewListing,
            readData,
            showEachBookDetail,
            placeOrder,
            fetchMyOrders,
            logoutUser,
            UserData,
            user,
            isLoggedIn,
        }}>
            {props.children}
        </FirebaseContext.Provider>
    )
}
