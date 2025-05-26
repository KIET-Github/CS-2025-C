"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { GovernmentLevel } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa6";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  level: z.nativeEnum(GovernmentLevel, {
    errorMap: () => ({ message: "Please select a government level" }),
  }),
  website: z.string().url("Please enter a valid URL"),
});

const CreateGovernment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [message, setMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      level: undefined,
      website: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/governments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to create government entity");
        router.push(`/auth/profile-setup`);
        return;
      }

      setMessage(data.message || "Request submitted successfully.");
      router.push(`/auth/profile-setup`);
    } catch (error) {
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
      setMessage("Internal Server Error.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!message) return;
    toast({
      title: message,
    });
    setMessage(null);
  }, [message, toast]);

  return (
    <div className="min-h-screen flex flex-col bg-grid-white">
      <div className="w-full max-w-xl border rounded-md py-2 px-4 mt-4 mx-auto bg-background">
        <div className="mb-4">
          <h2 className="text-2xl">Government Entity Profile</h2>
          <span className="text-sm text-muted-foreground">
            Provide details about your government entity
          </span>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm transition-colors font-normal">
                    Government Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter government entity name"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm transition-colors font-normal">
                    Government Level
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select government level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="FEDERAL">Federal</SelectItem>
                      <SelectItem value="STATE">State</SelectItem>
                      <SelectItem value="LOCAL">Local</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm transition-colors font-normal">
                    Website
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.gov" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" /> Submitting Request...
                </>
              ) : (
                "Request New Government Entity"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateGovernment;
