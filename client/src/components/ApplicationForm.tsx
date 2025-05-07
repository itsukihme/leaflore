import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertModeratorApplicationSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";

const formSchema = insertModeratorApplicationSchema;

type FormData = z.infer<typeof formSchema>;

export default function ApplicationForm() {
  const { toast } = useToast();
  const [professionalismValue, setProfessionalismValue] = useState<number>(5);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      discordUsername: "",
      aboutYourself: "",
      whyJoin: "",
      timezone: "",
      activityLevel: "",
      professionalism: 5,
      joke: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => apiRequest("POST", "/api/apply", data),
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully!",
        variant: "default",
        className: "bg-[#4ade80] text-black font-medium",
      });
      reset();
      setProfessionalismValue(5);
    },
    onError: (error: any) => {
      // Check for rate limit error specifically
      const errorMessage = error?.response?.data?.message || 
                          (error instanceof Error ? error.message : "Failed to submit application");
      
      const isRateLimitError = errorMessage.includes("Too many applications submitted");
      
      toast({
        title: isRateLimitError ? "Rate Limited" : "Submission Error",
        description: errorMessage,
        variant: "destructive",
        duration: isRateLimitError ? 5000 : 3000, // Show rate limit errors longer
      });
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <Card className="bg-[#1e1e1e] scale-in">
      <CardContent className="pt-6 space-y-6">
        {/* Rate limit notification */}
        <div className="p-3 rounded-md bg-[#263d2d] border border-primary/20 text-sm">
          <p className="flex items-center">
            <i className="ri-information-line text-primary mr-2 text-lg"></i>
            <span>You can submit one application every 15 minutes. Please make sure all information is correct before submitting.</span>
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Discord Username Field */}
          <div className="space-y-2">
            <Label htmlFor="discordUsername" className="text-foreground">
              Discord Username <span className="text-primary">*</span>
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="ri-discord-fill text-primary"></i>
              </div>
              <Input
                id="discordUsername"
                placeholder="YourName#1234"
                className={`pl-10 bg-[#0f0f0f] border-[#2d2d2d] ${
                  errors.discordUsername ? "border-red-500 focus:ring-red-500" : "focus:ring-primary"
                }`}
                {...register("discordUsername")}
              />
            </div>
            {errors.discordUsername && (
              <p className="text-red-500 text-sm mt-1">{errors.discordUsername.message}</p>
            )}
          </div>

          {/* About Yourself Field */}
          <div className="space-y-2">
            <Label htmlFor="aboutYourself" className="text-foreground">
              Tell us about yourself <span className="text-primary">*</span>
            </Label>
            <Textarea
              id="aboutYourself"
              placeholder="Share a bit about yourself, your interests, and your experience..."
              className={`h-24 resize-none bg-[#0f0f0f] border-[#2d2d2d] ${
                errors.aboutYourself ? "border-red-500 focus:ring-red-500" : "focus:ring-primary"
              }`}
              {...register("aboutYourself")}
            />
            {errors.aboutYourself && (
              <p className="text-red-500 text-sm mt-1">{errors.aboutYourself.message}</p>
            )}
          </div>

          {/* Why Join Field */}
          <div className="space-y-2">
            <Label htmlFor="whyJoin" className="text-foreground">
              Why do you want to join? <span className="text-primary">*</span>
            </Label>
            <Textarea
              id="whyJoin"
              placeholder="Explain why you'd like to join our moderation team..."
              className={`h-20 resize-none bg-[#0f0f0f] border-[#2d2d2d] ${
                errors.whyJoin ? "border-red-500 focus:ring-red-500" : "focus:ring-primary"
              }`}
              {...register("whyJoin")}
            />
            {errors.whyJoin && <p className="text-red-500 text-sm mt-1">{errors.whyJoin.message}</p>}
          </div>

          {/* Timezone Field */}
          <div className="space-y-2">
            <Label htmlFor="timezone" className="text-foreground">
              What is your time zone? <span className="text-primary">*</span>
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <i className="ri-time-line text-primary"></i>
              </div>
              <Select
                onValueChange={(value) => setValue("timezone", value)}
                defaultValue=""
              >
                <SelectTrigger 
                  id="timezone" 
                  className={`pl-10 bg-[#0f0f0f] border-[#2d2d2d] ${
                    errors.timezone ? "border-red-500 focus:ring-red-500" : "focus:ring-primary"
                  }`}
                >
                  <SelectValue placeholder="Select your timezone" />
                </SelectTrigger>
                <SelectContent className="bg-[#1e1e1e] border-[#2d2d2d]">
                  <SelectItem value="UTC-12">UTC-12</SelectItem>
                  <SelectItem value="UTC-11">UTC-11</SelectItem>
                  <SelectItem value="UTC-10">UTC-10</SelectItem>
                  <SelectItem value="UTC-9">UTC-9</SelectItem>
                  <SelectItem value="UTC-8">UTC-8 (PST)</SelectItem>
                  <SelectItem value="UTC-7">UTC-7 (MST)</SelectItem>
                  <SelectItem value="UTC-6">UTC-6 (CST)</SelectItem>
                  <SelectItem value="UTC-5">UTC-5 (EST)</SelectItem>
                  <SelectItem value="UTC-4">UTC-4</SelectItem>
                  <SelectItem value="UTC-3">UTC-3</SelectItem>
                  <SelectItem value="UTC-2">UTC-2</SelectItem>
                  <SelectItem value="UTC-1">UTC-1</SelectItem>
                  <SelectItem value="UTC+0">UTC+0</SelectItem>
                  <SelectItem value="UTC+1">UTC+1 (CET)</SelectItem>
                  <SelectItem value="UTC+2">UTC+2</SelectItem>
                  <SelectItem value="UTC+3">UTC+3</SelectItem>
                  <SelectItem value="UTC+4">UTC+4</SelectItem>
                  <SelectItem value="UTC+5">UTC+5</SelectItem>
                  <SelectItem value="UTC+5:30">UTC+5:30 (IST)</SelectItem>
                  <SelectItem value="UTC+6">UTC+6</SelectItem>
                  <SelectItem value="UTC+7">UTC+7</SelectItem>
                  <SelectItem value="UTC+8">UTC+8</SelectItem>
                  <SelectItem value="UTC+9">UTC+9 (JST)</SelectItem>
                  <SelectItem value="UTC+10">UTC+10</SelectItem>
                  <SelectItem value="UTC+11">UTC+11</SelectItem>
                  <SelectItem value="UTC+12">UTC+12</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errors.timezone && <p className="text-red-500 text-sm mt-1">{errors.timezone.message}</p>}
          </div>

          {/* Activity Level Field */}
          <div className="space-y-2">
            <Label htmlFor="activityLevel" className="text-foreground">
              How active can you be? <span className="text-primary">*</span>
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <i className="ri-calendar-line text-primary"></i>
              </div>
              <Select
                onValueChange={(value) => setValue("activityLevel", value)}
                defaultValue=""
              >
                <SelectTrigger 
                  id="activityLevel" 
                  className={`pl-10 bg-[#0f0f0f] border-[#2d2d2d] ${
                    errors.activityLevel ? "border-red-500 focus:ring-red-500" : "focus:ring-primary"
                  }`}
                >
                  <SelectValue placeholder="Select your activity level" />
                </SelectTrigger>
                <SelectContent className="bg-[#1e1e1e] border-[#2d2d2d]">
                  <SelectItem value="Very Active (Daily)">Very Active (Daily)</SelectItem>
                  <SelectItem value="Active (4-6 days a week)">Active (4-6 days a week)</SelectItem>
                  <SelectItem value="Moderately Active (2-3 days a week)">Moderately Active (2-3 days a week)</SelectItem>
                  <SelectItem value="Occasionally (Once a week)">Occasionally (Once a week)</SelectItem>
                  <SelectItem value="Minimal (Less than once a week)">Minimal (Less than once a week)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errors.activityLevel && (
              <p className="text-red-500 text-sm mt-1">{errors.activityLevel.message}</p>
            )}
          </div>

          {/* Professionalism Scale Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="professionalism" className="text-foreground">
                On a scale from 1-10, how professional would you consider yourself? <span className="text-primary">*</span>
              </Label>
              <span className="font-bold text-primary ml-2">{professionalismValue}</span>
            </div>
            <Slider
              id="professionalism"
              min={1}
              max={10}
              step={1}
              defaultValue={[5]}
              value={[professionalismValue]}
              onValueChange={(value) => {
                setProfessionalismValue(value[0]);
                setValue("professionalism", value[0]);
              }}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
              <span>7</span>
              <span>8</span>
              <span>9</span>
              <span>10</span>
            </div>
            {errors.professionalism && (
              <p className="text-red-500 text-sm mt-1">{errors.professionalism.message}</p>
            )}
          </div>

          {/* Joke Field */}
          <div className="space-y-2">
            <Label htmlFor="joke" className="text-foreground">
              Tell us a joke <span className="text-primary">*</span>{" "}
              <span className="text-muted-foreground text-sm italic">(worth 99% of your grades)</span>
            </Label>
            <Textarea
              id="joke"
              placeholder="Your best joke goes here..."
              className={`h-20 resize-none bg-[#0f0f0f] border-[#2d2d2d] ${
                errors.joke ? "border-red-500 focus:ring-red-500" : "focus:ring-primary"
              }`}
              {...register("joke")}
            />
            {errors.joke && <p className="text-red-500 text-sm mt-1">{errors.joke.message}</p>}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-primary hover:bg-[#22c55e] text-[#121212] font-medium py-6 h-auto"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
