import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Clock, User, Calendar } from "lucide-react";
import InfoAlert from "./InfoAlert";
import SuccessMessage from "./SuccessMessage";
import { TIMEZONES, ACTIVITY_LEVELS } from "@/lib/constants";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  about: z.string().min(10, {
    message: "Please tell us a bit more about yourself (at least 10 characters).",
  }),
  whyJoin: z.string().min(10, {
    message: "Please explain why you want to join our team (at least 10 characters).",
  }),
  timezone: z.string({
    required_error: "Please select a timezone.",
  }),
  activityLevel: z.string({
    required_error: "Please select your activity level.",
  }),
  professionalism: z.number().min(1).max(10),
  joke: z.string().min(2, {
    message: "Please share a joke with us.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ApplicationForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      about: "",
      whyJoin: "",
      timezone: "",
      activityLevel: "",
      professionalism: 5,
      joke: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await apiRequest("POST", "/api/application", values);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit application. Please try again later.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: FormValues) {
    mutate(values);
  }

  if (isSubmitted) {
    return <SuccessMessage />;
  }

  return (
    <Card className="bg-card border-none shadow-lg">
      <CardContent className="p-6">
        <InfoAlert />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Discord Username <span className="text-primary ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input 
                        placeholder="YourName#1234" 
                        className="bg-[hsl(var(--discord-input))] border-none pl-10" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Tell us about yourself <span className="text-primary ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share a bit about yourself, your interests, and your experience..."
                      className="bg-[hsl(var(--discord-input))] border-none resize-none h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whyJoin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Why do you want to join? <span className="text-primary ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain why you'd like to join our moderation team..."
                      className="bg-[hsl(var(--discord-input))] border-none resize-none h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    What is your time zone? <span className="text-primary ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Clock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground z-10" />
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="bg-[hsl(var(--discord-input))] border-none pl-10">
                          <SelectValue placeholder="Select your timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIMEZONES.map((timezone) => (
                            <SelectItem key={timezone.value} value={timezone.value}>
                              {timezone.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="activityLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    How active can you be? <span className="text-primary ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground z-10" />
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="bg-[hsl(var(--discord-input))] border-none pl-10">
                          <SelectValue placeholder="Select your activity level" />
                        </SelectTrigger>
                        <SelectContent>
                          {ACTIVITY_LEVELS.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="professionalism"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between mb-4">
                    <FormLabel className="flex items-center">
                      On a scale from 1-10, how professional would you consider yourself? <span className="text-primary ml-1">*</span>
                    </FormLabel>
                    <span className="text-primary font-bold">{field.value}</span>
                  </div>
                  <FormControl>
                    <div>
                      <Slider
                        className="discord-slider"
                        min={1}
                        max={10}
                        step={1}
                        value={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                        style={{
                          background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${(field.value - 1) * 11.1}%, hsl(var(--discord-input)) ${(field.value - 1) * 11.1}%, hsl(var(--discord-input)) 100%)`
                        }}
                      />
                      <div className="relative w-full flex justify-between text-xs text-muted-foreground px-1 pt-2">
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
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="joke"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Tell us a joke <span className="text-primary ml-1">*</span>
                    <span className="text-muted-foreground ml-2 text-sm italic">(worth 99% of your grades)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Your best joke goes here..."
                      className="bg-[hsl(var(--discord-input))] border-none resize-none h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium" 
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
