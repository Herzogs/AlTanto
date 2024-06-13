class UserNotCreatedException extends Error {
    constructor(message: string) {
        message = message || "User not created";
        super(message);
    }
}

class UserNotFoundException extends Error {
    constructor(message: string) {
        message = message || "User not found";
        super(message);
    }
}

export { UserNotCreatedException, UserNotFoundException };

