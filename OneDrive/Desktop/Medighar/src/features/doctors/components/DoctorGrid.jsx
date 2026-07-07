import DoctorCard from "@/features/doctors/components/DoctorCard.jsx";

function DoctorGrid({ doctors }) {
  return (
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}

export default DoctorGrid;
