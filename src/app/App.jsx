import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import AppProviders from "./providers";

function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;
