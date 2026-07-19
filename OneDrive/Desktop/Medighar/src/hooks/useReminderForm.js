import { useCallback, useState } from "react";
import {
  createMedicineReminder,
  createAppointmentReminder,
} from "@/services/reminders/reminders.service.js";

const INITIAL_MEDICINE_VALUES = {
  medicineId: "",
  dosage: "",
  frequency: "Once Daily",
  startDate: "",
  endDate: "",
  reminderTime: "",
};

const INITIAL_APPOINTMENT_VALUES = {
  appointmentId: "",
  leadTime: "",
};

/**
 * Owns the combined reminder-creation form state for both reminder types.
 * One form, one submit handler, branching internally by the selected type
 * — avoids duplicating a near-identical form for each type.
 * @returns {{
 *   type: "medicine"|"appointment",
 *   setType: Function,
 *   medicineValues: object,
 *   appointmentValues: object,
 *   errors: Record<string, string>,
 *   updateMedicineField: (field: string, value: string) => void,
 *   updateAppointmentField: (field: string, value: string) => void,
 *   handleSubmit: (event: React.FormEvent) => void,
 * }}
 */
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

  const updateAppointmentField = useCallback((field, value) => {
    setAppointmentValues((previous) => ({ ...previous, [field]: value }));
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
