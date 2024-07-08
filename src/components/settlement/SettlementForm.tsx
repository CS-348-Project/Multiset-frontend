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
import {
  TSettlementMemberInfo,
  TSettlementCreateDTO,
} from "./types/SettlementTypes";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const FormSchema = z.object({
  receiver_user_id: z.coerce.number({ message: "Recipient required" }),
  amount: z.coerce.number().refine(
    (value) => {
      const decimalPlaces = value.toString().split(".")[1]?.length || 0;
      return decimalPlaces <= 2;
    },
    { message: "Maximum of 2 decimal places allowed" }
  ),
});

interface FormProps {
  submit: () => void;
}

export function SettlementForm({ submit }: FormProps) {
  const { toast } = useToast();
  const params = useParams<{ id: string }>();
  const group_id = Number(params.id);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      receiver_user_id: undefined,
      amount: 0,
    },
  });

  const [members, setMembers] = React.useState<TSettlementMemberInfo[]>([]);

  useEffect(() => {
    apiService
      .get("/api/groups/other-members", {
        params: {
          group_id,
          detailed: true,
        },
      })
      .then((response) => {
        setMembers(response.data);
      })
      .catch((e) => {
        toast({
          title: "Error",
          description: e.response.data.message,
          variant: "destructive",
        });
      });
  }, []);

  function onSubmit(data: Partial<TSettlementCreateDTO>) {
    data = {
      ...data,
      group_id,
      amount: data.amount ? data.amount * 100 : 0,
    };

    apiService
      .post("/api/settlements/create", data)
      .then(() => {
        toast({
          title: "Success",
          description: "Settlement submitted successfully",
          variant: "success",
        });
        submit();
      })
      .catch((e) => {
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
          name="receiver_user_id"
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
                  {members &&
                    members.map((member) => (
                      <SelectItem key={member.id} value={String(member.id)}>
                        {member.first_name} {member.last_name}
                      </SelectItem>
                    ))}
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
              <FormLabel>Amount ($)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    if (!isNaN(Number(e.target.value))) {
                      field.onChange(e.target.value);
                    }
                  }}
                />
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
