import { Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout.jsx";
import HomePage from "@/pages/Home/HomePage.jsx";
import SearchPage from "@/pages/Search/SearchPage.jsx";
import DoctorsPage from "@/pages/Doctors/DoctorsPage.jsx";
import DoctorDetailsPage from "@/pages/Doctors/DoctorDetailsPage.jsx";
import MedicinesPage from "@/pages/Medicines/MedicinesPage.jsx";
import MedicineDetailsPage from "@/pages/Medicines/MedicineDetailsPage.jsx";
import DiseasesPage from "@/pages/Diseases/DiseasesPage.jsx";
import DiseaseDetailsPage from "@/pages/Diseases/DiseaseDetailsPage.jsx";
import PharmaciesPage from "@/pages/Pharmacy/PharmaciesPage.jsx";
import PharmacyDetailsPage from "@/pages/Pharmacy/PharmacyDetailsPage.jsx";
import SavedPage from "@/pages/Saved/SavedPage.jsx";
import RecentPage from "@/pages/Recent/RecentPage.jsx";
import CompareMedicinesPage from "@/pages/CompareMedicines/CompareMedicinesPage.jsx";
import BookAppointmentPage from "@/pages/Appointments/BookAppointmentPage.jsx";
import AppointmentsPage from "@/pages/Appointments/AppointmentsPage.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/doctors/:doctorId" element={<DoctorDetailsPage />} />
        <Route path="/medicines" element={<MedicinesPage />} />
        <Route
          path="/medicines/:medicineId"
          element={<MedicineDetailsPage />}
        />
        <Route path="/diseases" element={<DiseasesPage />} />
        <Route path="/diseases/:diseaseId" element={<DiseaseDetailsPage />} />
        <Route path="/pharmacy" element={<PharmaciesPage />} />
        <Route path="/pharmacy/:pharmacyId" element={<PharmacyDetailsPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/recent" element={<RecentPage />} />
        <Route path="/compare" element={<CompareMedicinesPage />} />
        <Route
          path="/appointments/book/:doctorId"
          element={<BookAppointmentPage />}
        />
        <Route path="/appointments" element={<AppointmentsPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
