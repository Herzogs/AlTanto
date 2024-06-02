import ApiError from "../utilities/apiError";
import { HttpStatusCode } from "axios";

class UserNotCreatedException extends ApiError {
    constructor();
    constructor(message: string);
    constructor(message: string, statusCode: HttpStatusCode);
    constructor(message?: string, statusCode?: HttpStatusCode) {
        message = message || "User not created";
        statusCode = statusCode || HttpStatusCode.BadRequest;
        super(message, statusCode);
    }
}

export { UserNotCreatedException };

