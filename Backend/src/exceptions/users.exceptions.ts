import ApiError from "../utilities/apiError";
import {HttpStatusCode} from "axios";

class UserNotCreatedException extends ApiError {
    constructor(message: string= "User not created") {
        super(message, HttpStatusCode.BadRequest);
    }
}

export {UserNotCreatedException}