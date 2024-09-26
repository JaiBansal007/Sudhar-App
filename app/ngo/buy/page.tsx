import Buy from "@/Components/Ngo/Buy";
import Navbar from "@/Components/Ngo/Navbar";
import Footer from "@/Components/Ngo/Footer";
import { Toaster } from "react-hot-toast";

export default function Home(){
  return (
    <div>
      <Navbar />
      <Buy />
      <Footer/> 
      <Toaster />
    </div>
  )
}