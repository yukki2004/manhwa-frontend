import api from "../../services/apiClient";


export const getNotificationsApi = (PageIndex = 1, PageSize = 10) => {
    return api.get("/api/notification", {
        params: {
            PageIndex,
            PageSize
        }
    });
};


export const getUnreadNotificationCountApi = () => {
    return api.get("/api/notification/unread-count");
};


export const markNotificationAsReadApi = (id) => {
    return api.patch(`/api/notification/${id}/read`);
};


export const markAllNotificationsAsReadApi = () => {
    return api.patch("/api/notification/read-all");
};