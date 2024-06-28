import React, { useState, useEffect } from 'react';
import { updateUser, getUserById } from '../services/userService';
import { userStore } from "@store";
import { Container, Button } from "react-bootstrap";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from "react-router-dom";

function UserProfile({ handleClose }) {
    const { user } = userStore();
    const userId = user?.id;
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUserById(userId);
                console.log(userData)
                setUserData(userData);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        if (userId) {
            fetchUser();
        }
    }, [userId]);

    const handleUpdateUser = async () => {
        const updatedUserData = {
        };

        try {
            const updatedUser = await updateUser(userId, updatedUserData);
            setUserData(updatedUser);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <Container fluid className="pb-footer">
            <div className="text-center">
                <h1>
                    <AccountCircleIcon /> Perfil de Usuario
                </h1>
                {/* <Button variant="success" className="mt-3" onClick={handleUpdateUser}>
                    <EditIcon /> Guardar
                </Button> */}
            </div>

            <div className="mt-5">
                <h4 className="text-center">Detalles del Usuario</h4>
                <div className="container_zonas-item container">
                    <div className="zonas-item">
                        <h5>Nombre de usuario: {userData.username}</h5>
                        <p>Nombre: {userData.name}</p>
                        <p>Apellido: {userData.lastName}</p>
                        <p>Email: {userData.email}</p>
                        {/* Agrega más detalles según sea necesario */}
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default UserProfile;
