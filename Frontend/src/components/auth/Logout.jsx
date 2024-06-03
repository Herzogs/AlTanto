import { userStore } from "@store"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function Logout() {

  const { removeStores } = userStore()
  const navigate = useNavigate()

  useEffect(()=>{
    removeStores()
    navigate('/')
  },[])
  return null;
}

export default Logout