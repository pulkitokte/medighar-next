import { useCallback, useState } from "react";
import {
  createMedicineReminder,
  createAppointmentReminder,
} from "@/services/reminders/reminders.service.js";

const INITIAL_MEDICINE_VALUES = {
  memberId: "me",
  medicineId: "",
  dosage: "",
  frequency: "Once Daily",
  startDate: "",
  endDate: "",
  reminderTime: "",
};

const INITIAL_APPOINTMENT_VALUES = {
  memberId: "me",
  appointmentId: "",
  leadTime: "",
};

export function useReminderForm() {
  const [type, setType] = useState("medicine");
  const [medicineValues, setMedicineValues] = useState(INITIAL_MEDICINE_VALUES);
  const [appointmentValues, setAppointmentValues] = useState(
    INITIAL_APPOINTMENT_VALUES,
  );
  const [errors, setErrors] = useState({});

  const changeType = useCallback((nextType) => {
    setType(nextType);
    setErrors({});
  }, []);

  const updateMedicineField = useCallback((field, value) => {
    setMedicineValues((previous) => ({ ...previous, [field]: value }));
  }, []);

  /**
   * Updates a single field on the appointment-reminder form. When the
   * selected family member changes, the previously selected appointment
   * (if any) is cleared in the same update. This prevents a stale
   * appointment belonging to a different member from silently surviving
   * a member switch — the appointment dropdown is filtered by member in
   * RemindersPage.jsx, so a previously valid selection can become
   * invalid the moment memberId changes, and must not be submittable.
   */
  const updateAppointmentField = useCallback((field, value) => {
    setAppointmentValues((previous) => {
      if (field === "memberId") {
        return { ...previous, memberId: value, appointmentId: "" };
      }
      return { ...previous, [field]: value };
    });
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      const result =
        type === "medicine"
          ? createMedicineReminder(medicineValues)
          : createAppointmentReminder(appointmentValues);

      if (!result.success) {
        setErrors(result.errors);
        return;
      }

      setErrors({});
      if (type === "medicine") {
        setMedicineValues(INITIAL_MEDICINE_VALUES);
      } else {
        setAppointmentValues(INITIAL_APPOINTMENT_VALUES);
      }
    },
    [type, medicineValues, appointmentValues],
  );

  return {
    type,
    setType: changeType,
    medicineValues,
    appointmentValues,
    errors,
    updateMedicineField,
    updateAppointmentField,
    handleSubmit,
  };
}
