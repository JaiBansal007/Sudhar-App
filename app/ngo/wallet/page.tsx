import Wallet from '@/Components/Ngo/Wallet'
import Navbar from "@/Components/Ngo/Navbar";
import Footer from "@/Components/Ngo/Footer";


export default function Home(){
  return (
    <div>
      <Navbar />
      <Wallet />
      <Footer/>   
    </div>
  )
}