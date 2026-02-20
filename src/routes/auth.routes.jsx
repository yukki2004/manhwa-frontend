import { lazy } from "react";
import { PATHS } from "./paths";
import LoginPage from "../features/auth/pages/Login";
import RegisterPage from "../features/auth/pages/Register";
import ForgotPasswordPage from "../features/auth/pages/ForgotPassword";

const Login = lazy(() => import("../features/auth/pages/Login"));
const Register = lazy(() => import("../features/auth/pages/Register"));
const ForgotPassword = lazy(() => import("../features/auth/pages/ForgotPassword"));

export const authRoutes = [
  { path: PATHS.LOGIN, element: <LoginPage /> },
  { path: PATHS.REGISTER, element: <RegisterPage /> },
  { path: PATHS.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
];
