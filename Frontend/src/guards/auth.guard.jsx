import { userStore } from "@store"
import { Navigate, Outlet } from "react-router-dom"

export const AuthGuard = () => {
    const { token } = userStore()
    
    if (token === null) {
        return <Navigate to="/auth/login" />
    }
    
    return <Outlet />
}