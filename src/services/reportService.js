import api from "./apiClient";


export const postReportApi = (targetId, targetType, reason) => {
    return api.post("/api/report", {
        targetId,
        targetType,
        reason
    });
};