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
import RemindersPage from "@/pages/Reminders/RemindersPage.jsx";
import MedicalRecordsPage from "@/pages/MedicalRecords/MedicalRecordsPage.jsx";
import DashboardPage from "@/pages/Dashboard/DashboardPage.jsx";
import HealthCalendarPage from "@/pages/HealthCalendar/HealthCalendarPage.jsx";
import HealthInsightsPage from "@/pages/HealthInsights/HealthInsightsPage.jsx";
import MedicalProfilePage from "@/pages/MedicalProfile/MedicalProfilePage.jsx";
import FamilyProfilesPage from "@/pages/FamilyProfiles/FamilyProfilesPage.jsx";
import HealthTimelinePage from "@/pages/HealthTimeline/HealthTimelinePage.jsx";
import NotificationCenterPage from "@/pages/NotificationCenter/NotificationCenterPage.jsx";
import HealthReportsPage from "@/pages/HealthReports/HealthReportsPage.jsx";

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
        <Route path="/reminders" element={<RemindersPage />} />
        <Route path="/medical-records" element={<MedicalRecordsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/calendar" element={<HealthCalendarPage />} />
        <Route path="/insights" element={<HealthInsightsPage />} />
        <Route path="/medical-profile" element={<MedicalProfilePage />} />
        <Route path="/family" element={<FamilyProfilesPage />} />
        <Route path="/timeline" element={<HealthTimelinePage />} />
        <Route path="/notifications" element={<NotificationCenterPage />} />
        <Route path="/reports" element={<HealthReportsPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
