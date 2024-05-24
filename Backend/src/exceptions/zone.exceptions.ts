import ApiError from "../utilities/apiError";

class ZoneNotFoundException extends ApiError {
    constructor(message: string = "Zone not found") {
        super(message, 404);
    }
}

class ZoneNotCreatedException extends ApiError {
    constructor(message: string = "Zone could not be created") {
        super(message, 400);
    }
}

export { ZoneNotCreatedException, ZoneNotFoundException };