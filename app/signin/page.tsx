import Signin from '@/Components/Signin'
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

export default function Home(){
  return (
    <div>
      <Navbar />
      <Signin />   
      <Footer /> 
    </div>
  )
}