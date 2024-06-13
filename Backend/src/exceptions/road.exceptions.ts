class RoadNotFoundException extends Error {
    constructor(message: string = "Road not found") {
        super(message);
    }
}

class RoadNotCreatedException extends Error {
    constructor(message: string = "Road could not be created") {
        super(message);
    }
}

export { RoadNotCreatedException, RoadNotFoundException };