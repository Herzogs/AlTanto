import axios from "axios";

const REGISTER_URI = "http://localhost:3000/api/auth/register";

const registerUser = async (userData) => {
    try {
        const response = await axios.post(REGISTER_URI, userData);
        if (response.status !== 201) {
            throw new Error("Error al registrar usuario");
        }
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

export default registerUser;
