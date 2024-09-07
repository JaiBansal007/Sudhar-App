import Signin from '@/Components/Ngo/Signin'
import Navbar from "@/Components/Ngo/Navbar";
import Footer from "@/Components/Ngo/Footer";


export default function Home(){
  return (
    <div>
      <Navbar />
  
      <Signin />  
      <Footer /> 
    </div>
  )
}