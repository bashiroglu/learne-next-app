import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ScoreInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min: number;
  max: number;
  placeholder: string;
  allowHalfScores?: boolean;
}

export const ScoreInput = ({ label, value, onChange, min, max, placeholder, allowHalfScores = false }: ScoreInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty string for clearing the input
    if (inputValue === '') {
      onChange('');
      return;
    }
    
    if (allowHalfScores) {
      // Allow numbers with optional .5
      if (!/^\d+\.?\d*$/.test(inputValue)) {
        return;
      }
      
      const numValue = parseFloat(inputValue);
      
      // Block incomplete decimals
      if (inputValue.endsWith('.')) {
        onChange(inputValue);
        return;
      }
      
      // Block values above max
      if (numValue > max) {
        return;
      }
      
      // Block values below min
      if (numValue < min) {
        return;
      }
      
      // Allow only .0 or .5 increments
      const decimal = numValue - Math.floor(numValue);
      if (decimal !== 0 && decimal !== 0.5) {
        return;
      }
      
      onChange(inputValue);
    } else {
      // Block non-numeric characters (letters, spaces, negative signs, etc.)
      if (!/^\d+$/.test(inputValue)) {
        return;
      }
      
      const numValue = parseInt(inputValue, 10);
      
      // Block values above max
      if (numValue > max) {
        return;
      }
      
      // Block values below min (0)
      if (numValue < min) {
        return;
      }
      
      onChange(inputValue);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={label.toLowerCase()} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <Input
        id={label.toLowerCase()}
        type="text"
        inputMode="decimal"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="text-base transition-all focus:ring-2 focus:ring-primary"
      />
    </div>
  );
};
