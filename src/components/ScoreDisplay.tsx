interface ScoreDisplayProps {
  label: string;
  score: number | null;
  isOverall?: boolean;
}

export const ScoreDisplay = ({ label, score, isOverall = false }: ScoreDisplayProps) => {
  return (
    <div className={`p-4 rounded-lg ${isOverall ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted'}`}>
      <div className="text-sm font-medium opacity-90 mb-1">{label}</div>
      <div className={`${isOverall ? 'text-4xl' : 'text-3xl'} font-bold`}>
        {score !== null ? score.toFixed(1) : '-'}
      </div>
    </div>
  );
};
