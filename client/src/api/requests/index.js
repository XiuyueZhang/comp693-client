import api from "../config";


export const getUserInfoRequest = async (token) => {
    const response = await api.get('/user/info', {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    return response;
}

export const loginRequest = async(loginInfo) => {
    const response = await api.post('/login',{
        email: loginInfo.email,
        password: loginInfo.password
    });
    return response;
}

export const registerRequest = async(registerInfo) => {
    const response = await api.post('/register',{
        firstName:  registerInfo.firstName,
        lastName:  registerInfo.lastName,
        email: registerInfo.email,
        password: registerInfo.password
    });
    return response;
}

export const getHomepageContentRequest = async () => {
    const response = await api.get('/');
    return response;
}

export const getSelectedClassInfoRequest = async (classId) => {
    const response = await api.get(`/classes/${classId}`);
    return response;
}

export const getEnrolledClassInfoRequest = async (userId, token, role) => {
    const response = await api.get(`/user/enrolment/${userId}`,{
        headers: {
            "Authorization": `Bearer ${token}`,
            "role": role,
        },
    });
    return response;
}

export const userEnrollClassRequest = async(userId, classId, token, role) => {
    const data = {
        userId,
        classId
    }
    
    const response = await api.post("/user/class/addEnrolment", data, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "role": role,
        },
    });
    return response;
}

export const userRemoveClassRequest = async(userId, classId, token, role) => {
    const data = {
        userId,
        classId
    }
    const response = await api.delete("/user/class/deleteEnrolment", {
        data,
        headers: {
            "Authorization": `Bearer ${token}`,
            "role": role,
        }
    });
    return response;
}

export const adminAddClassRequest = async(data, token, role) => {
    const response = await api.post("/admin/class/add", data, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "role": role,
        },
    });
    return response;
}

export const adminUpdateClassRequest = async(data, token, role, classId) => {
    const response = await api.patch(`/admin/class/update/${classId}`, data, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "role": role,
        },
    });
    return response;
}
