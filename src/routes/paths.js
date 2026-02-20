export const PATHS = {
  // PUBLIC
  HOME: "/",
  GENRES: "/the-loai/:slug",
  SEARCH: "/tim-kiem",

  STORY_DETAIL: "/truyen/:slug",
  READING: "/truyen/:storySlug/:chapterSlug",

  // AUTH
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/quen-mat-khau",

  // USER
  PROFILE: "/ho-so",
  PRIVACY: "/chinh-sach-bao-mat",
  TERMS: "/dieu-khoan-su-dung",
  ABOUT: "/about-us",
  // STUDIO
  STUDIO_DASHBOARD: "/studio",
  CREATE_STORY: "/studio/dang-truyen", 
  MANAGE_STORY: "/studio/truyen/:id", 
  CREATE_CHAPTER: "/studio/truyen/:id/them-chapter", 
  EDIT_CHAPTER: "/studio/truyen/:id/chapter/:chapterId/sua", 
};
