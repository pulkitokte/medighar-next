import DiseaseCard from "@/features/diseases/components/DiseaseCard.jsx";

function DiseaseGrid({ diseases }) {
  return (
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {diseases.map((disease) => (
        <DiseaseCard key={disease.id} disease={disease} />
      ))}
    </div>
  );
}

export default DiseaseGrid;
