
import { onAuthStateChanged } from 'firebase/auth';
import { auth ,db} from '@/firebase/config';
import { getDoc ,doc, query, collection, getDocs, where} from 'firebase/firestore';
import bcrypt from 'bcrypt';
//interfaces
interface UserData{
    id:string ;
    balance: number;
    name:string;
    email:string;
    password:string;
    phone_number:number;
    

}
interface DealerData{
    id:string;
    email:string;
    password:string;
    balance:number;
    address:string;
    pincode:number;
    lng:string;
    lat:string;
    phone_number:number;
  
}
interface MCDData{
    id:string;
    email:string;
    password:string;
    pincode:number;
    
}  
interface trading{
    userid:string;
    dealerid:string;
    id:string;
    title:string;
    description:string;

    price:number;
    quantity:number;

    pincode:number;
    address:string;
    district:string; 
    state:string;
    createdAt: Date;

    status:'payment_done'|'pending';
}
interface UserOrder{

    userid:string;
    id:string;
    voucherPrice:number;
    voucherName:string;
    time:Date;

}
interface Complaints{
    userid:string;
    id:string;

    title:string;
    description:string;

    imageurl:string[];

    lat:string;
    lng:string;
    pincode:number;
    location:string;

    status: 'pending' | 'resolved';

    time:Date;



}
interface DealersOrder{
    dealerid:string;
    id:number;
    voucherPrice:number;
    voucherName:string;
    time:Date;

}

interface Post{
    id:string;
    userid:string;
    title:string;
    description:string;
    imageurl:string;
    createdAt:Date;
}

//AUTH
export const isLogin = (): Promise<boolean> => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
};

//USER
export const isUserExist= async (email: string): Promise<boolean> => {
    try{
      const q= query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    }catch(error){
        console.error("Error fetching user data:", error);
        throw error;
    }
}

export const getUserData = async (email: string): Promise<UserData> => {
    try{
        const q= query(collection(db, 'users'), where('email', '==', email));
        const querySnapshot = await getDocs(q);
        const UserData = querySnapshot.docs.map(doc => ({
            ...doc.data()
        }));
        return UserData;
    }catch(error){
        console.error("Error fetching user data:", error);
        throw error;
    }
}

//Dealer

export const isDealerExist= async (email: string): Promise<boolean> => {
    try{
      const q= query(collection(db, 'dealers'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    }catch(error){
        console.error("Error fetching dealer data:", error);
        throw error;
    }
}

export const getDealerData = async (email: string): Promise<DealerData> => {
    try{
      const q= query(collection(db, 'dealers'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      const DealerData = querySnapshot.docs.map(doc => ({
          ...doc.data()
      }));
      return DealerData;
    }catch(error){
        console.error("Error fetching dealer data:", error);
        throw error;
    }

}


//MCD

export const isMCDExist= async (email: string): Promise<boolean> => {
    try{
      const q= query(collection(db, 'mcd'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    }catch(error){
        console.error("Error fetching mcd data:", error);
        throw error;
    }

}

export const getMCDData = async (email: string): Promise<MCDData> => {
   try{
    const q= query(collection(db, 'mcd'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    const MCDData = querySnapshot.docs.map(doc => ({
        ...doc.data()
    }));
    return MCDData;
   }catch(error){
    console.error("Error fetching mcd data:", error);
    throw error;
   }

}


//orders

export const getuserallorders=async(userid:string):Promise<UserOrder[]>=>{
    try{
        const q= query(collection(db, 'orders'), where('userid', '==', userid));
        const querySnapshot = await getDocs(q);
        const orders = querySnapshot.docs.map(doc => ({
            ...doc.data()
        }));
        return orders;
    }catch(error){
        console.error("Error fetching user orders:", error);
        throw error;
    }
}

//dealer orders

export const getdealerallorders = async (dealerid: string): Promise<DealersOrder[]> => {
    try {
      const q = query(collection(db, 'dealer_orders'), where('dealerid', '==', dealerid));
      const querySnapshot = await getDocs(q);
      const orders = querySnapshot.docs.map(doc => ({
        ...doc.data()
      }));
      return orders;
    } catch (error) {
      console.error("Error fetching dealer orders:", error);
      throw error; 
    }
};

//complaints
export const getallcomplaints=async(pincode:string):Promise<Complaints[]>=>{
    try{
        const q= query(collection(db, 'complaints'), where('pincode', '==', pincode));
        const querySnapshot = await getDocs(q);
        const complaints = querySnapshot.docs.map(doc => ({
            ...doc.data()
        }));
        return complaints;
    }catch(error){
        console.error("Error fetching complaints:", error);
        throw error;
    }
}

//trading

export const getUsertradingdetails=async(userid:string):Promise<trading[]>=>{
    try{
        const q= query(collection(db, 'trading'), where('userid', '==', userid));
        const querySnapshot = await getDocs(q);
        const trading_details = querySnapshot.docs.map(doc => ({
            ...doc.data()
        }));
        return trading_details;
    }catch(error){
        console.error("Error fetching trading details:", error);
        throw error;
    }
}

export const getDealertradingdetails=async(dealerid:string):Promise<trading[]>=>{
    try{
        const q= query(collection(db, 'trading'), where('dealerid', '==', dealerid));
        const querySnapshot = await getDocs(q);
        const trading_details = querySnapshot.docs.map(doc => ({
            ...doc.data()
        }));
        return trading_details;
    }catch(error){
        console.error("Error fetching trading details:", error);
        throw error;
    }
}

//post 
export const getallposts=async():Promise<Post[]>=>{
    try{
        const q= query(collection(db, 'post'));
        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map(doc => ({
            ...doc.data()
        }));
        return posts;
    }catch(error){
        console.error("Error fetching posts:", error);
        throw error;
    }
}
