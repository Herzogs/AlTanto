import { userStore } from "@store"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function Logout() {

  const { setToken, setUser } = userStore()
  const navigate = useNavigate()

  useEffect(()=>{
    setToken(null)
    setUser( {
      name: null,
      lastName: null,
      email: null,
    })
    navigate('/')
  },[])
  return null;
}

export default Logout