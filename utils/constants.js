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
    NOT_FOUND: 404,
    NOT_AUTHORIZED: 401,
    BAD_REQUEST: 400,
    UNPROCESSIBLE_ENTITY: 422
}

module.exports = {
    USER_ROLE,
    USER_STATUS,
    STATUS_CODE
}