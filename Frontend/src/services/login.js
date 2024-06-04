import axiosInstance from "@interceptors/axiosConfig";

const LOGIN_URI = "/auth/login";

const loginUser = async (data) => {
    try {
        const response = await axiosInstance.post(LOGIN_URI, data);
        if (response.status !== 200) {
            console.error(response.statusText);
            throw new Error("Error al iniciar sesión");
        }
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

export default loginUser;
