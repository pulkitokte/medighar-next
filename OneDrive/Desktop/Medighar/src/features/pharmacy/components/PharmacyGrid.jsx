import PharmacyCard from "@/features/pharmacy/components/PharmacyCard.jsx";

function PharmacyGrid({ pharmacies }) {
  return (
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {pharmacies.map((pharmacy) => (
        <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
      ))}
    </div>
  );
}

export default PharmacyGrid;
