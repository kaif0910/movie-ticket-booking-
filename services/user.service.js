const User = require("../models/user.model");
const {USER_ROLE,USER_STATUS} = require("../utils/constants");

const createUser = async (data) => {
    try{
        if(!data.userRole || data.userRole == USER_ROLE.customer){
            if(data.userType || data.userType !== USER_STATUS.approved){
                throw {
                    err: "we cannot set any other status for customer",
                    code: 400
                };
            }
        }
        if(data.userRole && data.userRole !== USER_ROLE.customer){
            data.userStatus = USER_STATUS.pending;
        }
        const response = await User.create(data);
        return response ;
    } catch(error){
        console.log(error);
        if(error.name === "ValidationError"){
            let err = {};
            Object.keys(error.errors).forEach((key) => {
                err[key] = error.errors[key].message;
            });
            throw {err: err, code: 422 };
        }
        throw error;
    }
}

const getUserByEmail = async (email) => {
    // SignIn logic to be implemented
    try {
        let user = await User.findOne({
            email: email});
        if(!user){
        throw {err: "User not found, please sign up", code: 404};
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
            throw {err: "User not found", code: 404};
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
        let response = await User.findOneAndUpdate({
            _id: userId,
        },updateQuery,{new: true, runValidators: true});

        if(!response) throw {err: "No user found for the given id",code: 404};
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports ={
    createUser,
    getUserByEmail,
    userById,
    updateUserRoleOrStatus
}