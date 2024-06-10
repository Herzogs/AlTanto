class GroupNotFoundException extends Error {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'GroupNotFoundException';
        this.statusCode = 404;
    }
}

class GroupNotCreatedException extends Error {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'GroupNotCreatedException';
        this.statusCode = 400;
    }
}

class UserNotFoundException extends Error {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = 'UserNotFoundException';
        this.statusCode = 404;
    }
}

export { GroupNotFoundException, GroupNotCreatedException, UserNotFoundException};
