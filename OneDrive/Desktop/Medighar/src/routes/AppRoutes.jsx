import { Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout.jsx";
import HomePage from "@/pages/Home/HomePage.jsx";
import SearchPage from "@/pages/Search/SearchPage.jsx";
import DoctorsPage from "@/pages/Doctors/DoctorsPage.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
