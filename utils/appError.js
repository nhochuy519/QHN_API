
class AppError extends Error {
    constructor(message,statusCode) {
        super(message); // gọi constructor của lớp cha là Error

        this.statusCode=statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail':'error';
        this.isOperational = true;
        

    }
}

module.exports = AppError