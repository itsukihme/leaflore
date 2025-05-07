import { Info } from "lucide-react";

export default function InfoAlert() {
  return (
    <div className="bg-[hsl(var(--success-background))] text-foreground p-4 rounded-md mb-6 flex items-start">
      <div className="text-primary mr-3 mt-0.5">
        <Info className="h-6 w-6" />
      </div>
      <div>
        You can submit one application every 15 minutes. Please make sure all information is correct before submitting.
      </div>
    </div>
  );
}
