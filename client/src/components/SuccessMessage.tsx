import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function SuccessMessage() {
  return (
    <Card className="bg-card border-none shadow-lg">
      <CardContent className="p-6">
        <div className="bg-[hsl(var(--success-background))] text-white p-6 rounded-md text-center">
          <div className="mx-auto bg-primary rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <Check className="h-6 w-6 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">Application Submitted!</h3>
          <p className="text-muted-foreground">
            Thank you for applying to be a moderator. We'll review your application and get back to you soon.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
