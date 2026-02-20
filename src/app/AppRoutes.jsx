import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";

import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import StudioLayout from "../layouts/StudioLayout";

import RequireAuth from "../routes/RequireAuth";

import { authRoutes } from "../routes/auth.routes";
import { mainRoutes } from "../routes/main.routes";
import { studioRoutes } from "../routes/studio.routes";

function renderRoutes(routes) {
  return routes.map(({ path, element, protected: isProtected }) => {
    const el = isProtected ? (
      <RequireAuth>
        {element}
      </RequireAuth>
    ) : (
      element
    );

    return <Route key={path} path={path} element={el} />;
  });
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>

        {/* AUTH */}
        <Route element={<AuthLayout />}>
          {renderRoutes(authRoutes)}
        </Route>

        {/* MAIN */}
        <Route element={<MainLayout />}>
          {renderRoutes(mainRoutes)}
        </Route>

        {/* STUDIO */}
        <Route element={<RequireAuth />}>
          <Route element={<StudioLayout />}>
            {renderRoutes(studioRoutes)}
          </Route>
        </Route>

      </Routes>
    </Suspense>
  );
}
