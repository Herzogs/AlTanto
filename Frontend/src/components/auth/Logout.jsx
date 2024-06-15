/* eslint-disable react-hooks/exhaustive-deps */
import { userStore, useStore } from "@store"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function Logout() {

  const { setToken, setUser } = userStore()
  const { setReports } = useStore()
  const navigate = useNavigate()

  useEffect(()=>{
    setToken(null)
    setUser( {
      name: null,
      lastName: null,
      email: null,
    })
    setReports([])
    navigate('/')
  },[])
  return null;
}

export default Logout