import ApiError from "../utilities/apiError";

class CategoryNotFoundException extends ApiError {
    constructor(message: string = "Category not found") {
        super(message, 404);
    }
}

class CategoryNotCreatedException extends ApiError {
    constructor(message: string = "Category could not be created") {
        super(message, 400);
    }
}

export { CategoryNotCreatedException, CategoryNotFoundException };