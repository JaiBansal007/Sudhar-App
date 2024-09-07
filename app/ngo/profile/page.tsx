import Profile from '@/Components/Ngo/Profile'
import Navbar from "@/Components/Ngo/Navbar";
import Footer from "@/Components/Ngo/Footer";


export default function Home(){
  return (
    <div>
      <Navbar />
      <Profile />
      <Footer/>   
    </div>
  )
}