# API Contract & Schema Audit Document

This document presents a comprehensive, code-verified audit of all Mongoose schemas, routes, HTTP methods, authentication requirements, request body shapes, query parameters, and response shapes inferred directly from the application codebase (`app.js`, `controllers/`, `routes/`, `models/`, `middlewares/`, `services/`, and `utils/`).

---

## 1. Verbatim Mongoose Schemas

### 1.1 User Schema (`models/user.model.js`)
```javascript
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    email:{
        type: String,
        required : true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ , "please fill a valid email address"],
        localStorage: true,
        Trim: true
    },
    password:{
        type: String,
        required : true,
        minLength: 6
    },
    userRole:{
        type: String,
        required : true,
        enum:{
            values: [USER_ROLE.customer,USER_ROLE.admin,USER_ROLE.client],
            message: "Invalid user role given"
        },
        default: USER_ROLE.customer
    },
    userStatus:{
        type: String,
        required : true,
        enum:{
            values: [USER_STATUS.approved,USER_STATUS.pending,USER_STATUS.rejected],
            message: "Invalid user status given"
        },
        default: USER_STATUS.approved
    },
},{timestamps:true});
```

### 1.2 Booking Schema (`models/booking.model.js`)
```javascript
const bookingSchema = new mongoose.Schema(
  {
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatre",
      required: true
    },

    showId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    seats: {
      type: [String], // ["A1", "A2"]
      required: true,
    },

    totalCost: {
      type: Number,
      required: true
    },

    paymentId: {
      type: String
    },

    status: {
      type: String,
      enum: [
        BOOKING_STATUS.processing,
        BOOKING_STATUS.cancelled,
        BOOKING_STATUS.successfull,
        BOOKING_STATUS.expired
      ],
      default: BOOKING_STATUS.processing
    }
  },
  { timestamps: true }
);

bookingSchema.index(
  { showId: 1, seats: 1 },
  { unique: true }
);
```

### 1.3 Movie Schema (`models/movie.model.js`)
```javascript
const movieSchema = mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    description :{
        type: String,
        required : true,
    },
    casts:{
        type:[String],
        required : true
    },
    trailerUrl:{
        type: String,
        required : true
    },
    director:{
        type: String,
        required: true
    },
    language:{
        type:String,
        required : true,
        default: "English"
    },
    releaseDate:{
        type:String,
        required : true
    },
    releaseStatus:{
        type:String,
        required : true,
        default:"Released"
    },
},{timestamps:true});
```

### 1.4 Payment Schema (`models/payment.model.js`)
```javascript
const paymentSchema = new mongoose.Schema({
    bookingId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Booking"
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: [PAYMENT_STATUS.success,PAYMENT_STATUS.failed,PAYMENT_STATUS.pending],
            message: "Invalid payment status"
        },
        default: PAYMENT_STATUS.pending
    }
},{timestamps: true});
```

### 1.5 Show Schema (`models/show.model.js`)
```javascript
const showSchema = new mongoose.Schema(
  {
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatre",
      required: true
    },

    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true
    },

    timing:{
        type: String,
        required: true
    },

    noOfSeats:{
        type: Number,
        required: true
    },

    price:{
        type: Number,
        required: true
    },

    format: {
      type: String,
      enum: ["2D", "3D", "IMAX"],
      default: "2D"
    }
  },
  { timestamps: true }
);
```

### 1.6 Theatre Schema (`models/theatre.model.js`)
```javascript
const theatreSchema =new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 5
    },
    description:String,
    city:{
        type: String,
        required: true
    },
    pincode:{
        type: Number,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    movies:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Movie"
    }
},{timestamps: true})
```

---

## 2. System Constants & Response Utilities

### 2.1 Enums (`utils/constants.js`)
- **`USER_ROLE`**: `customer: "CUSTOMER"`, `admin: "ADMIN"`, `client: "CLIENT"`
- **`USER_STATUS`**: `approved: "APPROVED"`, `pending: "PENDING"`, `rejected: "REJECTED"`
- **`BOOKING_STATUS`**: `processing: "IN-PROCESS"`, `cancelled: "CANCELLED"`, `successfull: "SUCCESSFULL"`, `expired: "EXPIRED"`, `failed: "FAILED"`
- **`PAYMENT_STATUS`**: `failed: "FAILED"`, `success: "SUCCESS"`, `pending: "PENDING"`
- **`STATUS_CODE`**: `OK: 200`, `CREATED: 200`, `BAD_REQUEST: 400`, `NOT_AUTHORIZED: 401`, `PAYMENT_REQUIRED: 402`, `FORBIDDEN: 403`, `NOT_FOUND: 404`, `CONFLICT: 409`, `GONE: 410`, `UNPROCESSIBLE_ENTITY: 422`, `INTERNAL_SERVER_ERROR: 500`

### 2.2 Standard Response Structure (`utils/responsebody.js`)
Most endpoints return responses wrapped in standard templates:

**Success Response Template:**
```json
{
  "err": {},
  "data": {},
  "message": "successfully processed the request",
  "success": true
}
```

**Error Response Template:**
```json
{
  "err": {},
  "data": {},
  "message": "something went wrong, cannot process the request",
  "success": false
}
```

---

## 3. Detailed API Endpoint Audit

---

### 3.1 Health Check Route (`app.js`)

#### `GET /`
- **Auth Required**: None
- **Request Body**: None
- **Response Shape (200 OK)**:
```json
{
  "success": true
}
```

---

### 3.2 Authentication Routes (`routes/auth.routes.js`)

#### `POST /mba/api/v1/auth/signup`
- **Handler**: `authController.signup`
- **Middleware Chain**: `middleware.validateSignUpRequest`
- **Auth Required**: None
- **Request Body**:
```json
{
  "name": "string (required)",
  "email": "string (required, valid email format)",
  "password": "string (required, minlength 6)",
  "userRole": "CUSTOMER | ADMIN | CLIENT (optional, default: CUSTOMER)",
  "userStatus": "APPROVED | PENDING | REJECTED (optional)"
}
```
- **Validation / Business Rules**:
  - `name`, `email`, `password` must be present (400 if missing).
  - If `userRole` is `CUSTOMER` or omitted, custom `userStatus` (other than `APPROVED`) throws 400 Bad Request. `userStatus` is forced to `APPROVED`.
  - If `userRole` is non-customer (`ADMIN` or `CLIENT`), `userStatus` is automatically set to `PENDING`.
- **Response Shape (201 Created)**:
```json
{
  "err": {},
  "data": {
    "_id": "ObjectId",
    "name": "string",
    "email": "string",
    "password": "hashed_string",
    "userRole": "CUSTOMER | ADMIN | CLIENT",
    "userStatus": "APPROVED | PENDING | REJECTED",
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  },
  "message": "successfully registered the user",
  "success": true
}
```
- **Error Responses**:
  - `400 Bad Request`: Missing field or custom status violation for CUSTOMER.
  - `422 Unprocessable Entity`: Validation failure (e.g. duplicate email, invalid role/status enum).

#### `POST /mba/api/v1/auth/signin`
- **Handler**: `authController.signin`
- **Middleware Chain**: `middleware.validateSignInRequest`
- **Auth Required**: None
- **Request Body**:
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```
- **Validation / Business Rules**:
  - `email` and `password` required (400 if missing).
  - Validates password using bcrypt (`isValidPassword` method).
  - Generates JWT token with payload `{ userId: user._id, email: user.email }`, expiring in 1 hour.
- **Response Shape (200 OK)**:
```json
{
  "err": {},
  "data": {
    "email": "string",
    "token": "JWT token string"
  },
  "message": "successfully logged in",
  "success": true
}
```
- **Error Responses**:
  - `400 Bad Request`: Email or password not present.
  - `401 Unauthorized`: Invalid password.
  - `404 Not Found`: User not found.

#### `PATCH /mba/api/v1/auth/resetPassword`
- **Handler**: `authController.resetPassword`
- **Middleware Chain**: `middleware.isAuthenticated`
- **Auth Required**: Header `x-access-token` containing valid JWT token.
- **Request Body**:
```json
{
  "oldPassword": "string (required)",
  "newPassword": "string (required)"
}
```
- **Response Shape (200 OK)**:
```json
{
  "err": {},
  "data": {
    "_id": "ObjectId",
    "name": "string",
    "email": "string",
    "userRole": "string",
    "userStatus": "string",
    "updatedAt": "ISO date string"
  },
  "message": "successfully updated the password for the given user",
  "success": true
}
```
- **Error Responses**:
  - `401 Unauthorized`: Token verification failed.
  - `403 Forbidden`: Token header missing or invalid old password.
  - `404 Not Found`: User does not exist.

---

### 3.3 User Routes (`routes/user.routes.js`)

#### `PATCH /mba/api/v1/user/:userId`
- **Handler**: `userController.update`
- **Middleware Chain**: `authmiddleware.isAuthenticated`, `userMiddleware.validateUpdateUserRequest`, `authmiddleware.isAdmin`
- **Auth Required**: Header `x-access-token` (Must be an Admin).
- **Path Parameters**: `userId` (String)
- **Request Body**:
```json
{
  "userRole": "CUSTOMER | ADMIN | CLIENT (optional)",
  "userStatus": "APPROVED | PENDING | REJECTED (optional)"
}
```
- **Validation / Business Rules**:
  - At least one of `userRole` or `userStatus` must be present (400 if both missing).
- **Response Shape (200 OK)**:
```json
{
  "err": {},
  "data": {
    "_id": "ObjectId",
    "name": "string",
    "email": "string",
    "userRole": "CUSTOMER | ADMIN | CLIENT",
    "userStatus": "APPROVED | PENDING | REJECTED",
    "updatedAt": "ISO date string"
  },
  "message": "Successfully updated the user",
  "success": true
}
```
- **Error Responses**:
  - `400 Bad Request`: Neither `userRole` nor `userStatus` provided, or validation error.
  - `401 Unauthorized`: Requesting user is not an Admin.
  - `404 Not Found`: No user found for given ID.

---

### 3.4 Theatre Routes (`routes/theatre.routes.js`)

#### `POST /mba/api/v1/theatres`
- **Handler**: `theatreController.createTheatre`
- **Middleware Chain**: `authMiddleware.isAuthenticated`, `authMiddleware.isAdminOrClient`, `theatreMiddleware.validateCreateRequest`
- **Auth Required**: Header `x-access-token` (Admin or Client role).
- **Request Body**:
```json
{
  "name": "string (required, minlength 5)",
  "description": "string (required)",
  "city": "string (required)",
  "pincode": "number (required)",
  "address": "string (required)"
}
```
- **Business Rules**: `owner` field is automatically set from `req.user` (authenticated user).
- **Response Shape (201 Created)**:
```json
{
  "err": {},
  "data": {
    "_id": "ObjectId",
    "name": "string",
    "description": "string",
    "city": "string",
    "pincode": 123456,
    "address": "string",
    "owner": { "_id": "ObjectId", "name": "string", "email": "string", ... },
    "movies": [],
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  },
  "message": "successfully created the theatre",
  "success": true
}
```
- **Error Responses**:
  - `400 Bad Request`: Missing `name`, `description`, `city`, `pincode`, or `address`.
  - `422 Unprocessable Entity`: Mongoose validation failure (e.g. `name` < 5 chars).

#### `GET /mba/api/v1/theatres/:theatreId`
- **Handler**: `theatreController.getTheatre`
- **Middleware Chain**: None
- **Auth Required**: None
- **Path Parameters**: `theatreId` (ObjectId)
- **Response Shape (200 OK)**:
```json
{
  "err": {},
  "data": {
    "_id": "ObjectId",
    "name": "string",
    "description": "string",
    "city": "string",
    "pincode": 123456,
    "address": "string",
    "owner": "ObjectId",
    "movies": ["ObjectId"]
  },
  "message": "successfully fetched the theatre",
  "success": true
}
```
- **Error Responses**:
  - `404 Not Found`: No theatre found for given ID.

#### `DELETE /mba/api/v1/theatres/:theatreId`
- **Handler**: `theatreController.deleteTheatre`
- **Middleware Chain**: `authMiddleware.isAuthenticated`, `authMiddleware.isAdminOrClient`
- **Auth Required**: Header `x-access-token` (Admin or Client role).
- **Path Parameters**: `theatreId` (ObjectId)
- **Response Shape (200 OK)**:
```json
{
  "err": {},
  "data": { ...Deleted Theatre Object... },
  "message": "successfully deleted the theatre",
  "success": true
}
```
- **Error Responses**:
  - `404 Not Found`: No record found for given ID.

#### `GET /mba/api/v1/allTheatres`
- **Handler**: `theatreController.getAllTheatres`
- **Middleware Chain**: None
- **Auth Required**: None
- **Response Shape (200 OK)**:
```json
{
  "err": {},
  "data": [ ...Array of Theatre Objects... ],
  "message": "Successfully fetched all the Theatres",
  "success": true
}
```

#### `PATCH /mba/api/v1/theatres/:theatreId/movies`
- **Handler**: `theatreController.updateMoviesInTheatres`
- **Middleware Chain**: `theatreMiddleware.validateUpdateMovies`
- **Auth Required**: None
- **Path Parameters**: `theatreId` (ObjectId)
- **Request Body**:
```json
{
  "movieIds": ["ObjectId"],
  "insert": true
}
```
- **Validation / Business Rules**:
  - `movieIds` must be a non-empty array.
  - If `insert` is `true`, movies are added to theatre via `$addToSet`. If `false`, movies are removed via `$pull`.
  - Returns theatre object with populated `movies`.
- **Response Shape (200 OK)**:
```json
{
  "err": {},
  "data": {
    "_id": "ObjectId",
    "name": "string",
    "movies": [ { "_id": "ObjectId", "name": "string", ... } ]
  },
  "message": "successfully added movies to the required theatre",
  "success": true
}
```
- **Error Responses**:
  - `400 Bad Request`: `movieIds` missing or not array / empty.
  - `404 Not Found`: Theatre not found.

#### `GET /mba/api/v1/theatres`
- **Handler**: `theatreController.getAllTheatresInCity`
- **Middleware Chain**: None
- **Auth Required**: None
- **Query Parameters**:
  - `city` (string, optional)
  - `pincode` (number, optional)
  - `name` (string, optional)
  - `movieId` (ObjectId, optional)
  - `limit` (number, optional)
  - `skip` (number, optional - skip offset is calculated as `skip * limit` or `skip * 3` if limit is omitted)
- **Response Shape (200 OK)**:
```json
{
  "err": {},
  "data": [ ...Array of Theatre Objects... ],
  "message": "successfully fetched the theatres",
  "success": true
}
```

#### `PATCH /mba/api/v1/theatres/:theatreId` & `PUT /mba/api/v1/theatres/:theatreId`
- **Handler**: `theatreController.updateTheatre`
- **Middleware Chain**: None
- **Auth Required**: None
- **Path Parameters**: `theatreId` (ObjectId)
- **Request Body**: Partial or full Theatre fields (`name`, `description`, `city`, `pincode`, `address`, `owner`, `movies`)
- **Response Shape (200 OK)**:
```json
{
  "err": {},
  "data": { ...Updated Theatre Object... },
  "message": "successfully updated the theatre",
  "success": true
}
```
- **Error Responses**:
  - `404 Not Found`: Theatre not found.
  - `422 Unprocessable Entity`: Validation failure on updated fields.

#### `GET /mba/api/v1/theatres/:theatreId/movies`
- **Handler**: `theatreController.getMovies`
- **Middleware Chain**: None
- **Auth Required**: None
- **Path Parameters**: `theatreId` (ObjectId)
- **Response Shape (200 OK)**:
```json
{
  "err": {},
  "data": {
    "_id": "ObjectId",
    "name": "string",
    "address": "string",
    "movies": [ { "_id": "ObjectId", "name": "string", ... } ]
  },
  "message": "successfully fetched all the movies in the theatre",
  "success": true
}
```
- **Error Responses**:
  - `404 Not Found`: Theatre not found.

#### `GET /mba/api/v1/theatres/:theatreId/movies/:movieId`
- **Handler**: `theatreController.checkMovie`
- **Middleware Chain**: None
- **Auth Required**: None
- **Path Parameters**: `theatreId` (ObjectId), `movieId` (ObjectId)
- **Response Shape (200 OK)**:
```json
{
  "err": {},
  "data": true,
  "message": "successfully checked if a movie is present in the theatre",
  "success": true
}
```
- **Error Responses**:
  - `404 Not Found`: Theatre not found.

---

### 3.5 Movie Routes (`routes/movie.routes.js`)

#### `POST /mba/api/v1/movies`
- **Handler**: `movieController.createMovie`
- **Middleware Chain**: `movieMiddleware.validateCreateRequest`
- **Auth Required**: None
- **Request Body**:
```json
{
  "name": "string (required)",
  "description": "string (required)",
  "casts": ["string"] (required, non-empty array),
  "trailerUrl": "string (required)",
  "releaseDate": "string (required)",
  "director": "string (required)",
  "language": "string (optional, default: 'English')",
  "releaseStatus": "string (optional, default: 'Released')"
}
```
- **Response Shape (201 Created)**:
```json
{
  "err": {},
  "data": {
    "_id": "ObjectId",
    "name": "string",
    "description": "string",
    "casts": ["string"],
    "trailerUrl": "string",
    "director": "string",
    "language": "English",
    "releaseDate": "string",
    "releaseStatus": "Released",
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  },
  "message": "successfully created the movie",
  "success": true
}
```
- **Error Responses**:
  - `400 Bad Request`: Missing required field (`name`, `description`, `casts`, `trailerUrl`, `releaseDate`, `director`).
  - `422 Unprocessable Entity`: Validation failure.

#### `DELETE /mba/api/v1/movies/:movieId`
- **Handler**: `movieController.deleteMovie`
- **Middleware Chain**: None
- **Auth Required**: None
- **Path Parameters**: `movieId` (ObjectId)
- **Response Shape (200 OK)**:
```json
{
  "err": {},
  "data": { ...Deleted Movie Object... },
  "message": "successfully deleted the movie",
  "success": true
}
```

#### `GET /mba/api/v1/movies/:movieId`
- **Handler**: `movieController.getMovie`
- **Middleware Chain**: None
- **Auth Required**: None
- **Path Parameters**: `movieId` (ObjectId)
- **Response Shape (200 OK)**:
```json
{
  "err": {},
  "data": { ...Movie Object... },
  "success": true
}
```
- **Error Responses**:
  - `404 Not Found`: No movie found.

#### `PUT /mba/api/v1/movies/:movieId` & `PATCH /mba/api/v1/movies/:movieId`
- **Handler**: `movieController.updateMovie`
- **Middleware Chain**: None
- **Auth Required**: None
- **Path Parameters**: `movieId` (ObjectId)
- **Request Body**: Partial or full fields of Movie schema.
- **Response Shape (200 OK)**:
```json
{
  "err": {},
  "data": { ...Updated Movie Object... },
  "message": "successfully updated the movie",
  "success": true
}
```
- **Error Responses**:
  - `422 Unprocessable Entity`: Validation failure.

#### `GET /mba/api/v1/movies`
- **Handler**: `movieController.fetchMovies`
- **Middleware Chain**: None
- **Auth Required**: None
- **Query Parameters**: `name` (string, optional filter)
- **Response Shape (200 OK)**:
```json
{
  "err": {},
  "data": [ ...Array of Movie Objects... ],
  "success": true
}
```

---

### 3.6 Show Routes (`routes/show.routes.js`)

#### `POST /mba/api/v1/shows`
- **Handler**: `showController.create`
- **Middleware Chain**: `authMiddleware.isAuthenticated`, `showMiddleware.validateCreateShowRequest`
- **Auth Required**: Header `x-access-token`
- **Request Body**:
```json
{
  "theatreId": "ObjectId (required)",
  "movieId": "ObjectId (required)",
  "timing": "string (required)",
  "noOfSeats": "number (required)",
  "price": "number (required)",
  "format": "2D | 3D | IMAX (required by middleware, default '2D')"
}
```
- **Validation / Business Rules**:
  - Validates `theatreId` and `movieId` as Mongo ObjectIds.
  - Verifies Theatre exists and `movieId` is currently present in `theatre.movies`.
- **Response Shape (200 OK)** *(Note: `STATUS.CREATED` maps to `200`)*:
```json
{
  "err": {},
  "data": {
    "_id": "ObjectId",
    "theatreId": "ObjectId",
    "movieId": "ObjectId",
    "timing": "string",
    "noOfSeats": 100,
    "price": 250,
    "format": "2D",
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  },
  "message": "Successfully created the show",
  "success": true
}
```
- **Error Responses**:
  - `400 Bad Request`: Invalid or missing `theatreId`, `movieId`, or `format`.
  - `404 Not Found`: Theatre not found or movie not running in theatre.
  - `422 Unprocessable Entity`: Validation error on show model fields.

#### `GET /mba/api/v1/shows`
- **Handler**: `showController.getShows`
- **Middleware Chain**: None
- **Auth Required**: None
- **Query Parameters**:
  - `theatreId` (ObjectId, optional filter)
  - `movieId` (ObjectId, optional filter)
- **Response Shape (200 OK)**:
```json
{
  "err": {},
  "data": [ ...Array of Show Objects... ],
  "message": "Successfully fetched all the shows of the movie",
  "success": true
}
```

#### `DELETE /mba/api/v1/shows/:showId`
- **Handler**: `showController.deleteShow`
- **Middleware Chain**: `authMiddleware.isAuthenticated`, `authMiddleware.isAdminOrClient`
- **Auth Required**: Header `x-access-token` (Admin or Client role).
- **Path Parameters**: `showId` (ObjectId)
- **Response Shape (200 OK)**:
```json
{
  "err": {},
  "data": { ...Deleted Show Object... },
  "message": "Successfully deleted  the show of the movie",
  "success": true
}
```
- **Error Responses**:
  - `404 Not Found`: Show not found.

#### `PATCH /mba/api/v1/shows/:showId`
- **Handler**: `showController.updateShow`
- **Middleware Chain**: `authMiddleware.isAuthenticated`, `authMiddleware.isAdminOrClient`, `showMiddleware.validateUpdateShowRequest`
- **Auth Required**: Header `x-access-token` (Admin or Client role).
- **Path Parameters**: `showId` (ObjectId)
- **Request Body**: Updatable fields (`timing`, `noOfSeats`, `price`, `format`). Must NOT include `theatreId` or `movieId`.
- **Validation / Business Rules**:
  - Disallows updating `theatreId` or `movieId` (returns 400 Bad Request).
- **Response Shape (200 OK)**:
```json
{
  "err": {},
  "data": { ...Updated Show Object... },
  "message": "successfully updated the show",
  "success": true
}
```
- **Error Responses**:
  - `400 Bad Request`: Attempting to update `theatreId` or `movieId`.
  - `404 Not Found`: Show not found.
  - `422 Unprocessable Entity`: Validation failure.

---

### 3.7 Seat Routes (`routes/seat.routes.js`)

#### `POST /mba/api/v1/seat/lock`
- **Handler**: `seatController.lockSeats`
- **Middleware Chain**: `isAuthenticated`
- **Auth Required**: Header `x-access-token`
- **Request Body**:
```json
{
  "showId": "string (required)",
  "seats": ["string"] (required, e.g. ["A1", "A2"])
}
```
- **Business Logic**:
  - Checks Mongoose `Booking` collection for existing active bookings (status NOT in `["CANCELLED", "EXPIRED"]`) matching `showId` and any of `seats`. Returns `409 Conflict` if already booked.
  - Locks each seat in Redis using atomic `SET seatlock:<showId>:<seat> JSON.stringify({ userId }) NX EX 420` (7 minutes TTL). Returns `409 Conflict` if any seat is already locked.
- **Response Shape (200 OK)** *(Note: Custom non-wrapper format)*:
```json
{
  "message": "Seats locked successfully",
  "expiresIn": "7 minutes"
}
```
- **Error Responses (409 Conflict / 500 Server Error)**:
```json
{
  "success": false,
  "message": "One or more seats are already booked"
}
```

---

### 3.8 Booking Routes (`routes/booking.routes.js`)

#### `POST /mba/api/v1/bookings`
- **Handler**: `bookingController.create`
- **Middleware Chain**: `authMiddleware.isAuthenticated`, `bookingMiddleware.validateBookingRequest`
- **Auth Required**: Header `x-access-token`
- **Request Body**:
```json
{
  "theatreId": "ObjectId (required)",
  "showId": "ObjectId (required)",
  "seats": ["string"] (required non-empty array, e.g. ["A1", "A2"])
}
```
- **Validation / Business Rules**:
  - `theatreId` and `showId` validated for ObjectId format and DB existence.
  - `show.theatreId` must match requested `theatreId`.
  - Validates Redis lock for every seat (`seatlock:<showId>:<seat>` must exist in Redis and `parsed.userId === userId`).
  - Total cost calculated as `seats.length * show.price`.
  - Booking initialized with status `IN-PROCESS`.
- **Response Shape (200 OK)** *(STATUS.CREATED maps to 200)*:
```json
{
  "err": {},
  "data": {
    "_id": "ObjectId",
    "theatreId": "ObjectId",
    "showId": "ObjectId",
    "userId": "ObjectId",
    "seats": ["A1", "A2"],
    "totalCost": 500,
    "status": "IN-PROCESS",
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  },
  "message": "Successfully created the booking",
  "success": true
}
```
- **Error Responses**:
  - `400 Bad Request`: Missing or invalid `theatreId`, `showId`, or empty `seats`.
  - `404 Not Found`: Theatre or show not found, or show does not belong to theatre.
  - `409 Conflict`: One or more seats already booked (duplicate unique compound index on `{ showId, seats }`).

#### `PATCH /mba/api/v1/bookings/:bookingId`
- **Handler**: `bookingController.update`
- **Middleware Chain**: `authMiddleware.isAuthenticated`, `bookingMiddleware.canChangeStatus`
- **Auth Required**: Header `x-access-token`
- **Path Parameters**: `bookingId` (ObjectId)
- **Request Body**:
```json
{
  "status": "IN-PROCESS | CANCELLED | SUCCESSFULL | EXPIRED"
}
```
- **Validation / Business Rules**:
  - `canChangeStatus` middleware blocks users with `userRole === 'CUSTOMER'` from changing status to `CANCELLED` (returns 401 Not Authorized).
- **Response Shape (200 OK)**:
```json
{
  "err": {},
  "data": { ...Updated Booking Object... },
  "message": "successfully updated the booking",
  "success": true
}
```
- **Error Responses**:
  - `401 Not Authorized`: Customer user attempting to set status to CANCELLED.
  - `404 Not Found`: Booking not found.

#### `GET /mba/api/v1/bookings`
- **Handler**: `bookingController.getBookings`
- **Middleware Chain**: `authMiddleware.isAuthenticated`
- **Auth Required**: Header `x-access-token`
- **Business Logic**: Fetches all bookings belonging to the authenticated user.
- **Response Shape (200 OK)**:
```json
{
  "err": {},
  "data": [ ...Array of Booking Objects for user... ],
  "message": "Successfully fetched the bookings",
  "success": true
}
```

#### `GET /mba/api/v1/bookings/all`
- **Handler**: `bookingController.getAllBookings`
- **Middleware Chain**: `authMiddleware.isAuthenticated`, `authMiddleware.isAdmin`
- **Auth Required**: Header `x-access-token` (Admin role).
- **Response Shape (200 OK)**:
```json
{
  "err": {},
  "data": [ ...Array of All Booking Objects in system... ],
  "message": "Successfully fetched the bookings",
  "success": true
}
```

#### `GET /mba/api/v1/bookings/:bookingId`
- **Handler**: `bookingController.getBookingById`
- **Middleware Chain**: `authMiddleware.isAuthenticated`
- **Auth Required**: Header `x-access-token`
- **Path Parameters**: `bookingId` (ObjectId)
- **Response Shape (200 OK)**:
```json
{
  "err": {},
  "data": { ...Booking Object... },
  "message": "Successfully fetched the booking details",
  "success": true
}
```
- **Error Responses**:
  - `401 Not Authorized`: Booking does not belong to authenticated user.
  - `404 Not Found`: Booking not found.

---

### 3.9 Payment Routes (`routes/payment.routes.js`)

#### `POST /mba/api/v1/payments`
- **Handler**: `paymentController.create`
- **Middleware Chain**: `authMiddleware.isAuthenticated`, `paymentMiddleware.verifyPaymentCreateRequest`
- **Auth Required**: Header `x-access-token`
- **Request Body**:
```json
{
  "bookingId": "ObjectId (required)",
  "amount": "number (required)"
}
```
- **Business & Execution Workflow**:
  1. Validates presence and format of `bookingId` and `amount`.
  2. If booking status is already `SUCCESSFULL`: returns `403 Forbidden` ("Booking already completed").
  3. Checks time elapsed since `booking.createdAt`. If > 7 minutes: updates `booking.status = EXPIRED`, saves, and returns `410 Gone` / `400 Bad Request` ("The payment took more than 7 minutes to process").
  4. Creates Payment record with `status: PENDING`.
  5. If `amount !== booking.totalCost`: sets `payment.status = FAILED`, `booking.status = CANCELLED`, saves both, and returns `402 Payment Required` ("Payment failed, booking was cancelled. Please try again.").
  6. If `amount === booking.totalCost`: sets `payment.status = SUCCESS`, `booking.status = SUCCESSFULL`, saves both, releases Redis seat locks (`del seatlock:<showId>:<seat>`), triggers an asynchronous notification POST request to `NOTI_SERVICE`, and returns `200 Created` success.
- **Response Shape (200 Created - Payment Successful)**:
```json
{
  "err": {},
  "data": {
    "_id": "ObjectId",
    "theatreId": "ObjectId",
    "showId": "ObjectId",
    "userId": "ObjectId",
    "seats": ["A1", "A2"],
    "totalCost": 500,
    "status": "SUCCESSFULL",
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  },
  "message": "Payment successful. Booking confirmed.",
  "success": true
}
```
- **Error Responses**:
  - `400 Bad Request`: Missing `bookingId` or `amount`.
  - `402 Payment Required`: Amount mismatched with total cost (booking cancelled).
  - `403 Forbidden`: Booking is already completed.
  - `404 Not Found`: Booking not found.
  - `410 Gone`: Booking expired (> 7 minutes elapsed).

#### `GET /mba/api/v1/payments/:paymentId`
- **Handler**: `paymentController.getPaymentDetailsById`
- **Middleware Chain**: `authMiddleware.isAuthenticated`
- **Auth Required**: Header `x-access-token`
- **Path Parameters**: `paymentId` (ObjectId)
- **Response Shape (200 OK)**:
```json
{
  "err": {},
  "data": { ...Payment & Booking Details... },
  "message": "Successfully fetched the booking and payment details",
  "success": true
}
```

#### `GET /mba/api/v1/payments`
- **Handler**: `paymentController.getAllPayments`
- **Middleware Chain**: `authMiddleware.isAuthenticated`
- **Auth Required**: Header `x-access-token`
- **Response Shape (200 OK)**:
```json
{
  "err": {},
  "data": [ ...Array of Payment Objects... ],
  "message": "Successfully fetched all the payments",
  "success": true
}
```

---

## 4. Notable Backend Implementation Details & Discrepancies

During code analysis across controllers, middlewares, and services, the following specific code behaviors were observed:

1. **`req.user` vs `req.userId` context propagation**:
   - `auth.middlewares.js` (`isAuthenticated`) assigns `req.user = user` (the full Mongoose document).
   - `auth.middlewares.js` (`isAdmin`, `isClient`, `isAdminOrClient`), `booking.middlewares.js` (`canChangeStatus`), and `booking.controller.js` (`getBookings`) reference `req.userId`.
   - `seat.controller.js` references `req.user.id`, and `booking.controller.js` (`create`) references `req.user._id`.

2. **HTTP Status Code Mapping**:
   - `utils/constants.js` maps `STATUS_CODE.CREATED = 200`. Endpoints responding with `STATUS.CREATED` output HTTP 200 status code.

3. **Status Enums Spelling**:
   - `BOOKING_STATUS.successfull` is string `"SUCCESSFULL"` (double 'l').

4. **Redis Lock Key Format**:
   - Key: `seatlock:<showId>:<seat>`
   - TTL: 420 seconds (7 minutes).
   - Payload: `JSON.stringify({ userId })`.
