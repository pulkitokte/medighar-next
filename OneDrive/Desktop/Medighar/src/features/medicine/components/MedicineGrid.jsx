import MedicineCard from "@/features/medicine/components/MedicineCard.jsx";

function MedicineGrid({ medicines }) {
  return (
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {medicines.map((medicine) => (
        <MedicineCard key={medicine.id} medicine={medicine} />
      ))}
    </div>
  );
}

export default MedicineGrid;
