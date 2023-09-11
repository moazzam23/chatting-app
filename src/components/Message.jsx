import React from 'react'
import {HStack,Text, Avatar} from "@chakra-ui/react"

const Message = ({text,url,user="other"}) => {
  return (
  <HStack alignSelf={user=== "me"?"flex-end" : "flex-start"} border-Radius={"base"} bg="gray.100" paddingY={2} paddingX={user=== "me"? "4":"2"}>
  {
   user === "other" && <Avatar src={url}/>
}
  
  <Text>{text}</Text>
  {
   user === "me" && <Avatar src={url}/>
  
  }  
  </HStack>
    )
}

export default Message
