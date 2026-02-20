import api from "../../services/apiClient";


export const postChapterApi = (storyId, formData) => {
    return api.post(`/api/chap/${storyId}/chapter`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};


export const updateChapterApi = (chapterId, formData) => {
    return api.put(`/api/chap/${chapterId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};


export const publishChapterApi = (chapterId) => {
    return api.patch(`/api/chap/chapter/${chapterId}/publish`);
};


export const hideChapterApi = (chapterId) => {
    return api.patch(`/api/chap/chapter/${chapterId}/hidden`);
};


export const deleteChapterApi = (chapterId) => {
    return api.delete(`/api/chap/chapter/${chapterId}`);
};


export const getChapterDetailApi = (storySlug, chapterSlug) => {
    return api.get(`/api/chap/${storySlug}/${chapterSlug}`);
};