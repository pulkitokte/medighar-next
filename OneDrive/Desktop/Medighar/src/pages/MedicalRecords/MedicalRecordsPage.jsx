import {
  FileText,
  Search,
  Paperclip,
  Pencil,
  Trash2,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/shared/lib/cn.js";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import Button from "@/shared/components/ui/Button.jsx";
import FilterSelect from "@/shared/components/ui/FilterSelect.jsx";
import EmptyState from "@/shared/components/ui/EmptyState.jsx";
import EmptyRelationship from "@/shared/components/ui/EmptyRelationship.jsx";
import { useMedicalRecords } from "@/hooks/useMedicalRecords.js";
import { useRecordForm } from "@/hooks/useRecordForm.js";
import {
  RECORD_TYPES,
  ATTACHMENT_FILE_TYPES,
} from "@/services/records/records.service.js";

const TYPE_CLASSES = {
  Prescription: "bg-blue-50 text-blue-700",
  "Lab Report": "bg-purple-50 text-purple-700",
  "Scan / Imaging": "bg-cyan-50 text-cyan-700",
  "Vaccination Record": "bg-green-50 text-green-700",
  Other: "bg-slate-100 text-slate-600",
};

const SORT_OPTIONS = [
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
];

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

function RecordForm({
  values,
  errors,
  isEditing,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6"
    >
      <h3 className="text-base font-semibold text-slate-900">
        {isEditing ? "Edit Record" : "Add Medical Record"}
      </h3>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-slate-700">Record Title</span>
          <input
            type="text"
            value={values.title}
            onChange={(event) => onChange("title", event.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
          />
          <FieldError message={errors.title} />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-slate-700">Record Type</span>
          <select
            value={values.type}
            onChange={(event) => onChange("type", event.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-blue-400 focus:outline-none"
          >
            <option value="">Select record type</option>
            {RECORD_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <FieldError message={errors.type} />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-slate-700">Doctor Name</span>
          <input
            type="text"
            value={values.doctorName}
            onChange={(event) => onChange("doctorName", event.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
          />
          <FieldError message={errors.doctorName} />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-slate-700">Hospital / Clinic</span>
          <input
            type="text"
            value={values.hospital}
            onChange={(event) => onChange("hospital", event.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
          />
          <FieldError message={errors.hospital} />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-slate-700">Record Date</span>
          <input
            type="date"
            value={values.date}
            onChange={(event) => onChange("date", event.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
          />
          <FieldError message={errors.date} />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-slate-700">
            Attachment File Name
          </span>
          <input
            type="text"
            placeholder="e.g. blood-test-report.pdf"
            value={values.attachmentFileName}
            onChange={(event) =>
              onChange("attachmentFileName", event.target.value)
            }
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-slate-700">
            Attachment File Type
          </span>
          <select
            value={values.attachmentFileType}
            onChange={(event) =>
              onChange("attachmentFileType", event.target.value)
            }
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-blue-400 focus:outline-none"
          >
            <option value="">Select file type</option>
            {ATTACHMENT_FILE_TYPES.map((fileType) => (
              <option key={fileType} value={fileType}>
                {fileType}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium text-slate-700">Notes</span>
          <textarea
            value={values.notes}
            onChange={(event) => onChange("notes", event.target.value)}
            rows={3}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-400 focus:outline-none"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit">
          {isEditing ? "Save Changes" : "Add Record"}
        </Button>
        {isEditing && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

function RecordCard({ record, onEdit, onDelete }) {
  const formattedDate = new Date(record.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-slate-900">
          {record.title}
        </h3>
        <span
          className={cn(
            "inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-medium",
            TYPE_CLASSES[record.type],
          )}
        >
          {record.type}
        </span>
      </div>

      <div className="flex flex-col gap-1 text-sm text-slate-600">
        <span>
          {record.doctorName} · {record.hospital}
        </span>
        <span>{formattedDate}</span>
      </div>

      <div className="flex items-center gap-1.5 text-sm text-slate-500">
        <Paperclip className="h-4 w-4 shrink-0" aria-hidden="true" />
        {record.attachment
          ? `${record.attachment.fileName} (${record.attachment.fileType})`
          : "No attachment"}
      </div>

      {record.notes && (
        <p className="line-clamp-2 text-sm text-slate-600">{record.notes}</p>
      )}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(record)}
          leftIcon={<Pencil className="h-3.5 w-3.5" aria-hidden="true" />}
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(record.id)}
          leftIcon={<Trash2 className="h-3.5 w-3.5" aria-hidden="true" />}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

function RecordGrid({ records, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {records.map((record) => (
        <RecordCard
          key={record.id}
          record={record}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

function MedicalRecordsPage() {
  const {
    filteredRecords,
    recentRecords,
    groupedByYear,
    sortedYears,
    totalCount,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    sortBy,
    setSortBy,
    remove,
  } = useMedicalRecords();

  const {
    values,
    errors,
    isEditing,
    updateField,
    startEdit,
    resetForm,
    handleSubmit,
  } = useRecordForm();

  const handleDelete = (id) => {
    remove(id);
    if (isEditing) resetForm();
  };

  return (
    <Section paddingY="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <PageHeading
          title="Medical Records"
          subtitle="Keep track of your prescriptions, reports, and medical history in one place."
          center
        />

        <RecordForm
          values={values}
          errors={errors}
          isEditing={isEditing}
          onChange={updateField}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />

        {totalCount === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No medical records yet."
            description="Add a prescription, lab report, or other medical record above to see it here."
          />
        ) : (
          <>
            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Recent Records
              </h2>

              {recentRecords.length === 0 ? (
                <EmptyRelationship message="No recent records." />
              ) : (
                <RecordGrid
                  records={recentRecords}
                  onEdit={startEdit}
                  onDelete={handleDelete}
                />
              )}
            </section>

            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:flex-wrap sm:items-end sm:gap-6">
              <div className="flex flex-1 flex-col gap-1.5 text-sm">
                <span className="font-medium text-slate-700">Search</span>
                <div className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3">
                  <Search
                    className="h-4 w-4 shrink-0 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search by title or doctor..."
                    className="h-full w-full min-w-0 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <FilterSelect
                label="Record Type"
                value={typeFilter}
                options={["All", ...RECORD_TYPES]}
                onChange={setTypeFilter}
              />

              <div className="flex flex-col gap-1.5 text-sm">
                <span className="font-medium text-slate-700">Sort by</span>
                <div className="flex items-center gap-2">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      aria-pressed={sortBy === option.key}
                      onClick={() => setSortBy(option.key)}
                      className={cn(
                        "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                        sortBy === option.key
                          ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <section className="flex flex-col gap-10">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <FileText
                  className="h-5 w-5 text-blue-600"
                  aria-hidden="true"
                />
                All Records
              </h2>

              {filteredRecords.length === 0 ? (
                <EmptyRelationship message="No records match your search or filters." />
              ) : (
                sortedYears.map((year) => (
                  <div key={year} className="flex flex-col gap-4">
                    <h3 className="text-base font-semibold text-slate-700">
                      {year}
                    </h3>
                    <RecordGrid
                      records={groupedByYear[year]}
                      onEdit={startEdit}
                      onDelete={handleDelete}
                    />
                  </div>
                ))
              )}
            </section>
          </>
        )}
      </Container>
    </Section>
  );
}

export default MedicalRecordsPage;
