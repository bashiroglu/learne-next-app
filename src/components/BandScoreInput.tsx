import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BandScoreInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

// Valid IELTS band scores: 0, 0.5, 1, 1.5, ... 8.5, 9
const VALID_BAND_SCORES = [
  "0", "0.5", "1", "1.5", "2", "2.5", "3", "3.5",
  "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5",
  "8", "8.5", "9"
];

export const BandScoreInput = ({ id, value, onChange }: BandScoreInputProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id}>
        <SelectValue placeholder="Select score" />
      </SelectTrigger>
      <SelectContent>
        {VALID_BAND_SCORES.map((score) => (
          <SelectItem key={score} value={score}>
            {score === "0" ? "Select" : score}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
