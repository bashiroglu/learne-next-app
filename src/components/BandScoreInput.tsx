import { useState } from "react";
import { Input } from "@/components/ui/input";

interface BandScoreInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

const VALID_IELTS_PATTERN = /^(0(\.5)?|[1-8](\.5)?|9)$/;

export const BandScoreInput = ({ id, value, onChange }: BandScoreInputProps) => {
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty input while typing
    if (inputValue === "") {
      onChange("0");
      setError("");
      return;
    }

    // Allow partial inputs while typing (e.g., "6." or just a digit)
    if (/^[0-9]\.?5?$/.test(inputValue)) {
      // Check if it's a complete valid IELTS score
      if (VALID_IELTS_PATTERN.test(inputValue)) {
        const num = parseFloat(inputValue);
        if (num >= 0 && num <= 9) {
          onChange(inputValue);
          setError("");
          return;
        }
      }
      // Allow partial input like "6." for user to complete typing
      if (/^[0-9]\.?$/.test(inputValue)) {
        // Keep showing current value, wait for completion
        return;
      }
    }

    // Invalid input
    setError("IELTS scores must be in whole or half bands only.");
    setTimeout(() => setError(""), 2000);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // On blur, validate and reset if invalid
    if (!VALID_IELTS_PATTERN.test(inputValue)) {
      onChange("0");
      setError("");
    }
  };

  return (
    <div className="relative">
      <Input
        id={id}
        type="text"
        inputMode="decimal"
        value={value === "0" ? "" : value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="0-9"
        className={error ? "border-destructive" : ""}
      />
      {error && (
        <p className="text-xs text-destructive mt-1 absolute">{error}</p>
      )}
    </div>
  );
};
