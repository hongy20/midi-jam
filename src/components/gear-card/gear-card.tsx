import { Piano } from "lucide-react";
import styles from "./gear-card.module.css";

interface GearCardProps {
  instrument: WebMidi.MIDIInput;
  isSelected: boolean;
  isActive: boolean;
  onClick: () => void;
}

export function GearCard({
  instrument,
  isSelected,
  isActive,
  onClick,
}: GearCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.card} ${isSelected ? styles.selected : styles.unselected}`}
    >
      {/* Active Pulse Background */}
      <div
        className={`${styles.pulse} ${isActive ? styles.pulseActive : ""}`}
      />

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

      {/* Pulse ring when active */}
      {isActive && <div className={styles.ring} />}
    </button>
  );
}
