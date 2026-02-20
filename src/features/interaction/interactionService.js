import api from "../../services/apiClient";


export const followStoryApi = (storyId) => {
    return api.post(`/api/interaction/follow/${storyId}`);
};


export const unfollowStoryApi = (storyId) => {
    return api.post(`/api/interaction/unfollow/${storyId}`);
};


export const postCommentApi = (commentData) => {
    const payload = { ...commentData };
    if (!payload.parentId || payload.parentId === 0) {
        delete payload.parentId;
    }
    return api.post("/api/interaction/commnent", payload); 
};


export const updateCommentApi = (commentId, content) => {
    return api.put(`/api/interaction/comment/${commentId}`, {
        content
    });
};


export const deleteCommentApi = (commentId) => {
    return api.delete(`/api/interaction/comment/${commentId}`);
};


export const publishCommentApi = (commentId) => {
    return api.patch(`/api/interaction/comment/${commentId}/publish`);
};


export const hideCommentApi = (commentId) => {
    return api.patch(`/api/interaction/comment/${commentId}/hide`);
};


export const rateStoryApi = (storyId, score) => {
    return api.put(`/api/interaction/stories/${storyId}/rating`, {
        score
    });
};


export const getStoryCommentsApi = (storySlug, PageIndex = 1, PageSize = 10) => {
    return api.get(`/api/interaction/stories/${storySlug}/comments`, {
        params: { PageIndex, PageSize }
    });
};


export const getChapterCommentsApi = (storySlug, chapterSlug, PageIndex = 1, PageSize = 10) => {
    return api.get(`/api/interaction/stories/${storySlug}/chapters/${chapterSlug}/comments`, {
        params: { PageIndex, PageSize }
    });
};

export const getCommentRepliesApi = (parentId, PageIndex = 1, PageSize = 10) => {
    return api.get(`/api/interaction/comments/${parentId}/replies`, {
        params: {
            PageIndex,
            PageSize
        }
    });
};