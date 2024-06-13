class ZoneNotFoundException extends Error {
    constructor(message: string = "Zone not found") {
        super(message);
    }
}

class ZoneNotCreatedException extends Error {
    constructor(message: string = "Zone could not be created") {
        super(message);
    }
}

export { ZoneNotCreatedException, ZoneNotFoundException };