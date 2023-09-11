import { useEffect, useRef, useState } from "react";
import {Box, Button, Container, HStack, Input, VStack} from "@chakra-ui/react"
import Message from "./components/Message";
import { onAuthStateChanged,getAuth, GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth"
import { app } from "./firebase";
import {addDoc,onSnapshot, query,orderBy,collection, getFirestore, serverTimestamp} from "firebase/firestore"
import "./App.css"
import {AiFillWechat} from "react-icons/ai"

const auth=getAuth(app);
const db =getFirestore(app);

const logouthandler=()=>{  signOut(auth);}

const loginHandler = ()=> {
      const provider= new GoogleAuthProvider();
      signInWithPopup(auth,provider)}; 

  
function App() {
const q=query(collection(db,"Messages"),orderBy("createdAt","asc"))
  const [user,setUser]=useState(false);
 const[message,setMessage]=useState("")
const[messages, setMessages]=useState([]);
const divforscroll=useRef(null)

const submithandler= async(e)=>{
  e.preventDefault();

  try {
    setMessage("");
    await addDoc(collection(db,"Messages"),{
     text:message,
     uid:user.uid,
     uri:user.photoURL,
     createdAt:serverTimestamp(),
   });

  divforscroll.current.scrollintoview({behaviour:"smooth"});
} catch (error) {
   alert(error);
  }
}    

  useEffect( ()=> {

         const unsubscribe=  onAuthStateChanged(auth, (data) => {
            setUser(data);
           });

const unsubscribeformessage = onSnapshot(q,
  (snap)=>{

   setMessages(
    snap.docs.map((item) => {
      const id =item.id;
      return{id,...item.data()};
    })
   )  
})
           return ()=>{
                unsubscribe();
                unsubscribeformessage();
           };
  
          }, []);

  return (
  <Box bg={"red.100"}>
   { user ? (
     <Container h={"100vh"} bg={"white"}>
     <VStack h={"full"}  paddingY={"4"}>
       <Button onClick={logouthandler} colorScheme={"red"} w={"100"}>
         Logout
       </Button>

       <VStack h={"full"} w={"full"}  overflowY={"auto"}>
       {
         messages.map((item)=>(
          <Message 
          key={item.id}
          user={item.uid===user.uid ? "me":"other"}
          text={item.text}
          uri={item.uri}/>

         ))
       }
  <div ref={divforscroll}></div>
       </VStack>

     <form  onSubmit={submithandler} style={{width:"100%"}}>
     <HStack>
       <Input  value={message} onChange={(e)=>{setMessage(e.target.value)}} placeholder={"enter a message..."}/>
     <Button colorScheme={"purple"}type="submit"> Send </Button>
     </HStack>
     </form>
     </VStack>

 </Container>
   ):(
      <VStack bg="black" justifyContent={"center"} h={"100vh"} style={{ width:"100"}}> 
     <AiFillWechat className="icon"/>
     <h1 className="signin">  Welcome To Real-Time Chatting App </h1>
      <Button colorScheme={"purple"} onClick={loginHandler}> Sign IN With Google </Button>
    </VStack>
   )}
  </Box>
  )
}
export default App;