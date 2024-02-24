class ApiError extends Error {

    constructor(
        statusCode,
        message= "Something went wrong ?",
        errors = [],
        errorStack = ""
    ) {
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.errors = errors
        this.success = false
        this.data = null

        if (errorStack) {
            this.errorStack = errorStack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}