import api from "../../services/apiClient";


export const postStoryApi = (formData) => {
    return api.post("/api/story/post-story", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};


export const updateStoryApi = (storyId, storyData) => {
    return api.put(`/api/story/${storyId}`, storyData);
};


export const updateStoryAvatarApi = (storyId, formData) => {
    return api.patch(`/api/story/${storyId}/avatar`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};


export const publishStoryApi = (storyId) => {
    return api.patch(`/api/story/${storyId}/publish`);
};


export const hideStoryApi = (storyId) => {
    return api.patch(`/api/story/${storyId}/hidden`);
};


export const setStoryOngoingApi = (storyId) => {
    return api.patch(`/api/story/${storyId}/ongoing`);
};


export const setStoryDroppedApi = (storyId) => {
    return api.patch(`/api/story/${storyId}/drop`);
};


export const setStoryCompletedApi = (storyId) => {
    return api.patch(`/api/story/${storyId}/complete`);
};


export const deleteStoryApi = (storyId) => {
    return api.delete(`/api/story/${storyId}`);
};


export const getStoryRankingApi = () => {
    return api.get("/api/story/ranking");
};

// src/features/story/storyService.js

export const filterStoriesApi = (filterParams) => {
  const params = new URLSearchParams();

  Object.entries(filterParams).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== null && item !== undefined && item !== "") {
          params.append(key, item); // CategorySlugs=romance&CategorySlugs=horror
        }
      });
    } else {
      params.append(key, value);
    }
  });

  return api.get("/api/story/filter?" + params.toString());
};


export const getStoryDetailBySlugApi = (slug, PageIndex = 1, PageSize = 10) => {
    return api.get(`/api/story/${slug}`, {
        params: {
            PageIndex,
            PageSize
        }
    });
};

export const getMyStoriesApi = (PageIndex = 1, PageSize = 10) => {
    return api.get("/api/story/my_stories", {
        params: {
            PageIndex,
            PageSize
        }
    });
};
export const getHotStoriesApi = () => {
    return api.get("/api/story/hot"); 
};
export const getManagementStoriesApi = (id, PageIndex = 1, PageSize = 30) => {
    return api.get(`/api/story/${id}/management-detail`, { // Sử dụng dấu huyền `` và ${id}
        params: { PageIndex, PageSize }
    });
};