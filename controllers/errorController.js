const AppError = require("../utils/appError");

// To handle error received at development mode
const sendDevelopmentError = (err, req, res ) => {
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        err: err,
        stack: err.stack
    })
}


const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if(process.env.NODE_ENV === "development"){
        sendDevelopmentError(err, req, res);
    }
}


module.exports = globalErrorHandler;