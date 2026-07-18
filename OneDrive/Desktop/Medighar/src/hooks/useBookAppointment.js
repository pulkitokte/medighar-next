import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDoctorById } from "@/services/doctors/doctors.service.js";
import {
  validateAppointmentForm,
  createAppointment,
} from "@/services/appointments/appointments.service.js";

const INITIAL_VALUES = {
  patientName: "",
  age: "",
  gender: "",
  phone: "",
  email: "",
  date: "",
  timeSlot: "",
  consultationType: "in-person",
  reason: "",
};

/**
 * Owns the booking form state and submission flow for a single doctor.
 * The doctor id is read from the route params, matching the *Details
 * hooks' convention.
 * @returns {{
 *   doctor: object|null,
 *   notFound: boolean,
 *   values: object,
 *   errors: Record<string, string>,
 *   updateField: (field: string, value: string) => void,
 *   handleSubmit: (event: React.FormEvent) => void,
 * }}
 */
export function useBookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const doctor = useMemo(() => getDoctorById(doctorId), [doctorId]);
  const notFound = doctor === null;

  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});

  const updateField = useCallback((field, value) => {
    setValues((previous) => ({ ...previous, [field]: value }));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      const { errors: validationErrors, isValid } =
        validateAppointmentForm(values);

      if (!isValid) {
        setErrors(validationErrors);
        return;
      }

      createAppointment({ doctorId, ...values });
      navigate("/appointments");
    },
    [doctorId, values, navigate],
  );

  return { doctor, notFound, values, errors, updateField, handleSubmit };
}
