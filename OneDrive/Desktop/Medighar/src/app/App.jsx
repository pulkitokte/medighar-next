import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "@/shared/components/ScrollToTop.jsx";
import AppRoutes from "@/routes/AppRoutes.jsx";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
