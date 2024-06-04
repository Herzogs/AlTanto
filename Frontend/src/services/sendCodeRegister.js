import axios from "axios";

const VALIDATION_URI = "http://localhost:3000/api/auth/validate-code";

const validateCode = async (data) => {
    try {
        const response = await axios.post(VALIDATION_URI, data);
        if (response.status !== 201) {
            throw new Error("Error al validar el código");
        }
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

export default validateCode;
