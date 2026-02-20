import api from "./apiClient";
import axios from "axios";
export const getAllCategoryApi = () => {
    return api.get("/api/category/get-all-category");
};