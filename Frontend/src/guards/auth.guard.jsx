import { userStore } from "@store"
import { Navigate, Outlet } from "react-router-dom"

export const AuthGuard = () => {
    const { user } = userStore()
    
    if (user.id === null) {
        return <Navigate to="/login" />
    }
    
    return <Outlet />
}