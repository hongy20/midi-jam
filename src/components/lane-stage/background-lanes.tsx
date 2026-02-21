import { getNoteUnitOffset, isBlackKey } from "@/lib/device/piano";

interface BackgroundLanesProps {
    notes: number[];
}

/**
 * Static lanes matching the piano keys.
 */
export function BackgroundLanes({ notes }: BackgroundLanesProps) {
    return (
        <div
            className="absolute inset-0 grid pointer-events-none opacity-[0.03]"
            style={{
                gridTemplateColumns: "repeat(var(--piano-visible-units, 156), 1fr)",
            }}
        >
            {notes.map((note) => (
                <div
                    key={`lane-${note}`}
                    className="h-full border-r border-foreground"
                    data-black={isBlackKey(note)}
                    style={{
                        gridColumn: `calc(${getNoteUnitOffset(note)} - var(--piano-start-unit) + 1) / span ${isBlackKey(note) ? 2 : 3}`,
                        backgroundColor: isBlackKey(note)
                            ? "rgba(0,0,0,0.2)"
                            : "transparent",
                    }}
                />
            ))}
        </div>
    );
};
