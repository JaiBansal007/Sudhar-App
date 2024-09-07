import Complaint from '@/Components/Complaint'
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

export default function Home(){
  return (
    <div>
      <Navbar />
      <Complaint /> 
      <Footer />   
    </div>
  )
}

