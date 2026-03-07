import { Piano } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import styles from "./gear-card.module.css";

interface GearCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  instrument: WebMidi.MIDIInput;
  isSelected: boolean;
}

export function GearCard({
  instrument,
  isSelected,
  onClick,
  className = "",
  ...props
}: GearCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.card} ${isSelected ? styles.selected : styles.unselected} ${className}`}
      {...props}
    >
      <div
        className={`${styles.iconWrapper} ${
          isSelected ? styles.iconSelected : styles.iconUnselected
        }`}
      >
        <Piano className={styles.icon} />
      </div>

      <div className={styles.info}>
        <span
          className={`${styles.name} ${isSelected ? styles.nameSelected : styles.nameUnselected}`}
          title={instrument.name || "Unknown Device"}
        >
          {instrument.name || "Unknown Device"}
        </span>
        <span
          className={`${styles.manufacturer} ${
            isSelected
              ? styles.manufacturerSelected
              : styles.manufacturerUnselected
          }`}
        >
          {instrument.manufacturer || "Generic MIDI Input"}
        </span>
      </div>
    </button>
  );
}
