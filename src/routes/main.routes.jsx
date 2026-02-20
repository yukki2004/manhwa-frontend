import { lazy } from "react";
import { PATHS } from "./paths";
import PrivacyPolicy from "../features/story/pages/PrivacyPolicy";
import TermsOfService from "../features/story/pages/TermsOfService";
import AboutUs from "../features/story/pages/AboutUs";
const Home = lazy(() => import("../features/story/pages/Home"));
const Genres = lazy(() => import("../features/story/pages/Genres"));
const Search = lazy(() => import("../features/story/pages/Search"));

const StoryDetail = lazy(() => import("../features/story/pages/StoryDetail"));
const ChapterReader = lazy(() => import("../features/chapter/pages/ChapterReader"));

const Profile = lazy(() => import("../features/profile/pages/Profile"));

export const mainRoutes = [
  { path: PATHS.HOME, element: <Home /> },
  { path: PATHS.GENRES, element: <Genres /> },
  { path: PATHS.SEARCH, element: <Search /> },
  { path: PATHS.STORY_DETAIL, element: <StoryDetail /> },
  { path: PATHS.READING, element: <ChapterReader /> },
  { path: PATHS.PRIVACY, element: <PrivacyPolicy /> },
  { path: PATHS.TERMS, element: <TermsOfService /> },
  { path: PATHS.ABOUT, element: <AboutUs /> },
  { path: PATHS.PROFILE, element: <Profile />, protected: true },
];
