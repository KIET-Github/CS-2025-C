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
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa6";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  website: z.string().url(),
});

const CreateCompany = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [message, setMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      website: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to create company");
        router.push(`/auth/profile-setup`);
        return;
      }

      setMessage(data.message || "Request Submitted successfully.");
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
          <h2 className="text-2xl">Company Profile</h2>
          <span className="text-sm text-muted-foreground">
            Provide details about your company
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
                    Company Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm transition-colors font-normal">
                    Address
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company address" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm transition-colors font-normal">
                    City
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm transition-colors font-normal">
                    State/Province
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter state or province" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm transition-colors font-normal">
                    Website (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
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
                "Request New Company"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateCompany;
