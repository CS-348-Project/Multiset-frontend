import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Checkbox } from "../ui/checkbox";

import { UserInfo } from "@/types/UserInfo";
import { dollarsToCents } from "@/utils/currencyConverter";
import { centsToDollars } from "@/utils/currencyConverter";
import { useParams } from "react-router-dom";
import { AutoComplete, AutoCompleteCompleteEvent } from "primereact/autocomplete";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  category: z.string(),
  total_cost: z.number(),
  purchase_splits: z.array(
    z.object({
      borrower: z.number(),
      amount: z.number(),
    })
  ),
  group_id: z.number(),
});

interface RecurringPurchase {
  name: string;
  category: string;
  total_cost: number;
}

interface FormProps {
  submit: () => void;
  initialData?: Partial<z.infer<typeof FormSchema>>;
  recurringPurchases: RecurringPurchase[];
}

export function PurchaseForm({ submit, initialData, recurringPurchases }: FormProps) {
  const [value, setValue] = useState<string>('');
  const [items, setItems] = useState<string[]>([]);

  const search = (event: AutoCompleteCompleteEvent) => {
    if (!recurringPurchases || recurringPurchases.length === 0) {
      setItems([]);
      return;
    }
    
    const filtered = recurringPurchases.filter((purchase) =>
      purchase.name.toLowerCase().includes(event.query.toLowerCase())
    );
    setItems(filtered.map(p => p.name));
  };
  
  const onSelect = (e: { value: string }) => {
    if (!recurringPurchases || recurringPurchases.length === 0) return;
  
    const selectedPurchase = recurringPurchases.find(p => p.name === e.value);
    if (selectedPurchase) {
      form.setValue("name", selectedPurchase.name);
      form.setValue("category", selectedPurchase.category);
      form.setValue("total_cost", parseFloat(centsToDollars(selectedPurchase.total_cost)));
      console.log("Selected purchase:", selectedPurchase);
    }
  };
  const { toast } = useToast();
  const [loading, setIsLoading] = useState(false);
  const [usersInGroup, setUsersInGroup] = useState<UserInfo[]>([]);

  const params = useParams<{ id: string }>();
  const group_id = Number(params.id);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: initialData?.name || "",
      category: initialData?.category || "",
      total_cost: initialData?.total_cost || 0,
      purchase_splits: initialData?.purchase_splits || [],
      group_id: group_id,
    },
  });

  useEffect(() => {
    setIsLoading(true);
    apiService
      .get("/api/groups/other-members", {
        params: {
          group_id,
          detailed: true,
        },
      })
      .then((response) => {
        setUsersInGroup(response.data);
        setIsLoading(false);
      });
  }, [group_id]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    data = {
      ...data,
      purchase_splits: data.purchase_splits.map((split: any) => ({
        ...split,
        amount: dollarsToCents(split.amount),
      })),
      total_cost: dollarsToCents(data.total_cost),
      group_id: group_id,
    };
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    apiService
      .post("/api/purchases/new-purchase", data)
      .then(() => {
        toast({
          title: "Success",
          description: "Purchase submitted successfully",
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
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="purchase-name">Name</FormLabel>
                  <FormControl>
                    <div>
                    <AutoComplete 
                      id="purchase-name"
                      value={field.value}
                      suggestions={items} 
                      completeMethod={search} 
                      onChange={(e) => field.onChange(e.value)}
                      onSelect={onSelect}
                      placeholder="Ex: Apples"
                    />
                    </div>
                  </FormControl>
                  <FormDescription>
                    A short description of what you purchased!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Groceries" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="total_cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Cost</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      value={field.value === 0 || isNaN(field.value) ? '' : field.value}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? 0 : Number(value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="purchase_splits"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Purchase Split</FormLabel>
                    {usersInGroup.map((user) => {
                      const split = field.value.find(
                        (split) => split.borrower === user.id
                      );
                      const isChecked = split !== undefined;
                      const amount = isChecked ? split?.amount : 0;

                      return (
                        <div
                          key={user.id}
                          className="flex flex-row items-center space-x-3 space-y-0 w-2/3"
                        >
                          <Checkbox
                            className="my-2"
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([
                                  ...(field.value || []),
                                  { borrower: user.id, amount: 0 },
                                ]);
                              } else {
                                field.onChange(
                                  field.value?.filter(
                                    (value) => value.borrower !== user.id
                                  )
                                );
                              }
                            }}
                          />
                          <FormLabel className="w-full">
                            {user.first_name} {user.last_name}
                          </FormLabel>
                          <div className="flex items-center justify-end w-full">
                            {isChecked && (
                              <div className="flex items-center">
                                <h3 className="text-sm mr-5">$</h3>
                                <Input
                                  type="number"
                                  className="w-100"
                                  placeholder="Enter a number"
                                  value={amount}
                                  onChange={(e) => {
                                    const updatedValue = Number(e.target.value);
                                    const updatedSplits = field.value.map(
                                      (split) => {
                                        if (split.borrower === user.id) {
                                          return {
                                            ...split,
                                            amount: updatedValue,
                                          };
                                        }
                                        return split;
                                      }
                                    );
                                    field.onChange(updatedSplits);
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </FormItem>
                );
              }}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      )}
    </>
  );
}
