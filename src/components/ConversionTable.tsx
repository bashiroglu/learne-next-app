import { Card } from "@/components/ui/card";

export const ConversionTable = () => {
  const listeningData = [
    { raw: "39-40", band: "9.0" },
    { raw: "37-38", band: "8.5" },
    { raw: "35-36", band: "8.0" },
    { raw: "32-34", band: "7.5" },
    { raw: "30-31", band: "7.0" },
    { raw: "26-29", band: "6.5" },
    { raw: "23-25", band: "6.0" },
    { raw: "18-22", band: "5.5" },
    { raw: "16-17", band: "5.0" },
    { raw: "13-15", band: "4.5" },
  ];

  const readingAcademicData = [
    { raw: "39-40", band: "9.0" },
    { raw: "37-38", band: "8.5" },
    { raw: "35-36", band: "8.0" },
    { raw: "33-34", band: "7.5" },
    { raw: "30-32", band: "7.0" },
    { raw: "27-29", band: "6.5" },
    { raw: "23-26", band: "6.0" },
    { raw: "19-22", band: "5.5" },
    { raw: "15-18", band: "5.0" },
    { raw: "13-14", band: "4.5" },
  ];

  const readingGeneralData = [
    { raw: "40", band: "9.0" },
    { raw: "39", band: "8.5" },
    { raw: "37-38", band: "8.0" },
    { raw: "36", band: "7.5" },
    { raw: "34-35", band: "7.0" },
    { raw: "32-33", band: "6.5" },
    { raw: "30-31", band: "6.0" },
    { raw: "27-29", band: "5.5" },
    { raw: "23-26", band: "5.0" },
    { raw: "19-22", band: "4.5" },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card className="p-4">
        <h3 className="font-semibold text-foreground mb-3">Listening Conversion</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium text-muted-foreground pb-2 border-b">
            <span>Raw Score</span>
            <span>Band Score</span>
          </div>
          {listeningData.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-foreground">{item.raw}</span>
              <span className="font-medium text-primary">{item.band}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold text-foreground mb-3">Reading - Academic</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium text-muted-foreground pb-2 border-b">
            <span>Raw Score</span>
            <span>Band Score</span>
          </div>
          {readingAcademicData.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-foreground">{item.raw}</span>
              <span className="font-medium text-primary">{item.band}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold text-foreground mb-3">Reading - General</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium text-muted-foreground pb-2 border-b">
            <span>Raw Score</span>
            <span>Band Score</span>
          </div>
          {readingGeneralData.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-foreground">{item.raw}</span>
              <span className="font-medium text-primary">{item.band}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
