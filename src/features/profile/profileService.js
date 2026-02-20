import api from "../../services/apiClient";


export const updateDescriptionApi = (description) => {
    return api.put("/api/profile/update-description", {
        description
    });
};


export const updateAvatarApi = (formData) => {
    return api.put("/api/profile/update-avt", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const changePasswordApi = (oldPassword, newPassword, confirmPassword) => {
    return api.put("/api/profile/change-password", {
        oldPassword,
        newPassword,
        confirmPassword
    });
};


export const getMyProfileApi = () => {
    return api.get("/api/profile/get-my-profile");
};
 

export const getUserProfileApi = (username) => {
    return api.get(`/api/profile/get-user-profile/${username}`);
};


export const getFavoritesApi = (UserId, PageIndex = 1, PageSize = 10) => {
    return api.get("/api/profile/favorites", {
        params: {
            UserId,
            PageIndex,
            PageSize
        }
    });
};

export const getHistoriesApi = (UserId, PageIndex = 1, PageSize = 10) => {
    return api.get("/api/profile/histories", {
        params: {
            UserId,
            PageIndex,
            PageSize
        }
    });
};