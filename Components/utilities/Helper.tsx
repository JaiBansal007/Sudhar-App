
import { onAuthStateChanged } from 'firebase/auth';
import { auth ,db} from '@/firebase/config';
import { getDoc ,doc, query, collection, getDocs, where} from 'firebase/firestore';

//interfaces
interface UserData{

}
interface DealerData{
  
}
interface MCDData{
    
}  
interface trading{

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

export const getuserallorders=async(userid:string):Promise<any>=>{
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

export const getdealerallorders = async (dealerid: string): Promise<any[]> => {
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

export const getallcomplaints=async(pincode:string):Promise<any[]>=>{
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
