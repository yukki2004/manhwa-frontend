import { lazy } from "react";
import { PATHS } from "./paths";

const Dashboard = lazy(() => import("../features/studio/pages/Dashboard"));
const CreateStory = lazy(() => import("../features/studio/pages/CreateStory"));
const ManageStory = lazy(() => import("../features/studio/pages/ManageStory"));
const CreateChapter = lazy(() => import("../features/studio/pages/CreateChapter"));
const EditChapter = lazy(() => import("../features/studio/pages/EditChapter"));

export const studioRoutes = [
  { 
    path: PATHS.STUDIO_DASHBOARD, 
    element: <Dashboard />, 
    protected: true 
  },
  { 
    path: PATHS.CREATE_STORY, 
    element: <CreateStory />, 
    protected: true 
  },
  { 
    path: PATHS.MANAGE_STORY, 
    element: <ManageStory />, 
    protected: true 
  },
  { 
    path: PATHS.CREATE_CHAPTER, 
    element: <CreateChapter />, 
    protected: true 
  },
  { 
    path: PATHS.EDIT_CHAPTER, 
    element: <EditChapter />, 
    protected: true 
  },
];