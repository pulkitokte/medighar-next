import { useCallback, useState } from "react";
import {
  createRecord,
  updateRecord,
} from "@/services/records/records.service.js";

const INITIAL_VALUES = {
  memberId: "me",
  title: "",
  type: "",
  doctorName: "",
  hospital: "",
  date: "",
  notes: "",
  attachmentFileName: "",
  attachmentFileType: "",
};

export function useRecordForm() {
  const [editingId, setEditingId] = useState(null);
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});

  const updateField = useCallback((field, value) => {
    setValues((previous) => ({ ...previous, [field]: value }));
  }, []);

  const startEdit = useCallback((record) => {
    setEditingId(record.id);
    setErrors({});
    setValues({
      memberId: record.memberId ?? "me",
      title: record.title,
      type: record.type,
      doctorName: record.doctorName,
      hospital: record.hospital,
      date: record.date,
      notes: record.notes ?? "",
      attachmentFileName: record.attachment?.fileName ?? "",
      attachmentFileType: record.attachment?.fileType ?? "",
    });
  }, []);

  const resetForm = useCallback(() => {
    setEditingId(null);
    setValues(INITIAL_VALUES);
    setErrors({});
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      const result = editingId
        ? updateRecord(editingId, values)
        : createRecord(values);

      if (!result.success) {
        setErrors(result.errors);
        return;
      }

      resetForm();
    },
    [editingId, values, resetForm],
  );

  return {
    values,
    errors,
    isEditing: editingId !== null,
    updateField,
    startEdit,
    resetForm,
    handleSubmit,
  };
}
