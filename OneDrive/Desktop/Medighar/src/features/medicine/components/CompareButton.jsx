import Button from "@/shared/components/ui/Button.jsx";
import { useComparison } from "@/hooks/useComparison.js";

/**
 * Toggle button for adding/removing a medicine from the comparison
 * selection. Stops click propagation so it can sit inside a navigable
 * MedicineCard without triggering navigation.
 * @param {{ medicineId: string, className?: string }} props
 */
function CompareButton({ medicineId, className }) {
  const { isSelected, toggle, isFull } = useComparison();
  const selected = isSelected(medicineId);
  const disabled = !selected && isFull;

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggle(medicineId);
  };

  return (
    <Button
      type="button"
      variant={selected ? "primary" : "outline"}
      size="sm"
      fullWidth
      disabled={disabled}
      onClick={handleClick}
      className={className}
      aria-pressed={selected}
    >
      {selected
        ? "Remove from Compare"
        : disabled
          ? "Compare (Max 4)"
          : "Compare"}
    </Button>
  );
}

export default CompareButton;
