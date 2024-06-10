import ApiError from "../utilities/apiError";

class RoadNotFoundException extends ApiError {
    constructor(message: string = "Road not found") {
        super(message, 200);
    }
}

class RoadNotCreatedException extends ApiError {
    constructor(message: string = "Road could not be created") {
        super(message, 200);
    }
}

export { RoadNotCreatedException, RoadNotFoundException };