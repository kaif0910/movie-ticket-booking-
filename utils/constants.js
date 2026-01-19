const USER_STATUS = {
    approved: "APPROVED",
    pending: 'PENDING',
    rejected: "REJECTED"
}

const USER_ROLE = {
    customer: "CUSTOMER",
    admin: "ADMIN",
    client: "CLIENT"
}

const STATUS_CODE = {
    OK: 200,
    INTERNAL_SERVER_ERROR: 500,
    CREATED: 200,
    NOT_FOUND: 404,
    NOT_AUTHORIZED: 401,
    BAD_REQUEST: 400,
    FORBIDDEN: 403,
    UNPROCESSIBLE_ENTITY: 422,
    GONE: 410,
    PAYMENT_REQUIRED: 402,
    CONFLICT: 409
}

const BOOKING_STATUS = {
    cancelled: "CANCELLED",
    successfull: "SUCCESSFULL",
    processing: "IN-PROCESS",
    expired: "EXPIRED",
    failed: "FAILED"
}

const PAYMENT_STATUS = {
    failed: "FAILED",
    success: "SUCCESS",
    pending: "PENDING"
}


module.exports = {
    USER_ROLE,
    USER_STATUS,
    STATUS: STATUS_CODE,
    BOOKING_STATUS,
    PAYMENT_STATUS
}