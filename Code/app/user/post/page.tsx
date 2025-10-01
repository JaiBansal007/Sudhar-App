import Post from '@/Components/user/Post'
import Navbar from "@/Components/user/Navbar";
import Footer from "@/Components/user/Footer";

export default function Home(){
  return (
    <div>
      <Navbar />
      <Post />   
      <Footer /> 
    </div>
  )
}