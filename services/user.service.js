const User = require("../models/user.model");
const {USER_ROLE,USER_STATUS} = require("../utils/constants");
const {STATUS} = require("../utils/constants");

const createUser = async (data) => {
    try {
        // Case 1: customer (or role not provided)
        if (!data.userRole || data.userRole === USER_ROLE.customer) {

            // customer must NOT set status manually
            if (
                data.userStatus &&
                data.userStatus !== USER_STATUS.approved
            ) {
                throw {
                    err: "Customer cannot set custom status",
                    code: STATUS.BAD_REQUEST
                };
            }

            // enforce approved status for customer
            data.userStatus = USER_STATUS.approved;
        }

        // Case 2: non-customer (admin, theatre-owner, etc.)
        if (data.userRole && data.userRole !== USER_ROLE.customer) {
            data.userStatus = USER_STATUS.pending;
        }

        const response = await User.create(data);
        return response;

    } catch (error) {
        console.log(error);

        if (error.name === "ValidationError") {
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });

            throw {
                err,
                code: STATUS.UNPROCESSIBLE_ENTITY
            };
        }

        throw error;
    }
};


const getUserByEmail = async (email) => {
    // SignIn logic to be implemented
    try {
        let user = await User.findOne({
            email: email});
        if(!user){
        throw {err: "User not found, please sign up", code: STATUS.NOT_FOUND};
            }
        return user;
    } catch (error) {
        console.log(error);
        throw error;
    }

}

const userById = async (userId) => {
    try {
        const user = await User.findById(userId);
        if(!user){
            throw {
                err: "User not found",
                code: STATUS.NOT_FOUND
            };
        }
        return user;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const updateUserRoleOrStatus = async (data,userId) => {
    try {
        let updateQuery = {};
        if(data.userRole) updateQuery.userRole = data.userRole;
        if(data.userStatus) updateQuery.userStatus = data.userStatus;
        let response = await User.findByIdAndUpdate(userId,updateQuery,updateQuery,{new: true, runValidators: true});
        if(!response) throw {err: "No user found for the given id",code: 404};
        return response;
    } catch (error) {
        console.log(error);
        if(error.name == "ValidationError"){
            let err ={};
            Object.keys(error.errors).forEach(key => {
                err[key] = error.errors[key].message;
            });
            throw {err: err,code: STATUS.BAD_REQUEST};
        }
        throw error;
    }
}

module.exports ={
    createUser,
    getUserByEmail,
    userById,
    updateUserRoleOrStatus
}