export const APP_KEYS = {
  TOKEN: "TOKEN",
  USER: "USER",
};

export const APP_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  HOME: "/",
  TASKS: "/tasks",
  PROFILE: "/profile",
  CHANGE_PASSWORD: "/change-password",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  DENTAL: "/dental",
};

export type AppKey = (typeof APP_KEYS)[keyof typeof APP_KEYS];
