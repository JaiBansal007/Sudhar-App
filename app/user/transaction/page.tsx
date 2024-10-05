import Transaction from '@/Components/user/Transaction'
import Navbar from "@/Components/user/Navbar";
import Footer from "@/Components/user/Footer";

export default function Home(){
  return (
    <div>
      <Navbar />
      <Transaction />  
      <Footer />  
    </div>
  )
}

