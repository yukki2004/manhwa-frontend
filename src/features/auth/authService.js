import api from "../../services/apiClient";
import axios from "axios";

export const registerApi = (username, email, password) => {
    return api.post("/api/auth/register", {
        username,
        email,
        password
    });
};
export const googleLoginApi = (idToken) => {
  return api.post("/api/auth/google-login", { idToken });
};
export const loginApi = (identifier, password) => {
    return api.post("/api/auth/login", {
        identifier,
        password
    });
};
export const refreshTokenApi = () => {
    return api.post("/api/auth/refresh-token");
};
export const logoutApi = () => {
    return api.post("/api/auth/logout");
};
export const forgotPasswordApi = (email) => {
    return api.post("/api/auth/forgot-password", {
        email
    });
};
export const verifyOtpApi = (email, otp) => {
    return api.post("/api/auth/verify-otp", {
        email,
        otp
    });
};
export const resetPasswordApi = (email, newPassword, otp, comfirmPassword) => {
    return api.post("/api/auth/reset-password", {
        email,
        newPassword,
        otp,
        comfirmPassword
    });
};