"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { apiService } from "@/utils/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TSettlementCreateDTO } from "./types/SettlementTypes";

const FormSchema = z.object({
  receiver_id: z.coerce.number({ message: "Recipient required" }),
  amount: z.coerce.number().refine(
    (value) => {
      const decimalPlaces = value.toString().split(".")[1]?.length || 0;
      return decimalPlaces <= 2;
    },
    { message: "Maximum of 2 decimal places allowed" }
  ),
});

export function SettlementForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      receiver_id: undefined,
      amount: 0,
    },
  });

  function onSubmit(data: Partial<TSettlementCreateDTO>) {
    // TODO: Remove the hardcoded sender_id
    data = {
      ...data,
      sender_id: 1,
      amount: data.amount ? data.amount * 100 : 0,
    };
    apiService
      .post("/api/settlements/save", data)
      .then(() => {
        toast({
          title: "Success",
          description: "Settlement submitted successfully",
          variant: "success",
        });
      })
      .catch((e) => {
        console.log("failed");
        toast({
          title: "Error",
          description: e.response.data.message,
          variant: "destructive",
        });
      });
  }

  return (
    <Form {...form}>
      <h2 className="font-semibold text-black text-xl my-5">
        Add a New Settlement
      </h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="receiver_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>To</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value ? String(field.value) : undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a recipient" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* TODO: replace with actual member data */}
                  <SelectItem value="1">Emma Huang</SelectItem>
                  <SelectItem value="2">Ben Ng</SelectItem>
                  <SelectItem value="3">Catherine Kim</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Who are you settling with?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
