import React, { useEffect } from "react";
import { TGroceryList, TGroceryListItem } from "./types/GroceryListTypes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiService } from "@/utils/api";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Trash2 } from "lucide-react";

interface TGroceryListFormProps {
  isOpen: boolean;
  onClose: () => void;
  groceryList: TGroceryList | null;
  onDelete: (id: number) => void;
}

export const GroceryListForm = ({
  isOpen,
  onClose,
  groceryList,
  onDelete,
}: TGroceryListFormProps) => {
  const [items, setItems] = React.useState<TGroceryListItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [addingItem, setAddingItem] = React.useState(false);
  const [addItemLoading, setAddItemLoading] = React.useState(false);

  const fetchItems = () => {
    if (!groceryList?.id) {
      return;
    }
    setLoading(true);
    apiService
      .get("/api/grocery-lists/items", {
        params: { grocery_list_id: groceryList.id },
      })
      .then((response) => {
        setItems(response.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    setItems([]);
    setAddingItem(false);
    form.reset();
    fetchItems();
  }, [isOpen, groceryList?.id]);

  const FormSchema = z.object({
    item_name: z.string().min(2, {
      message: "Item name must be at least 2 characters.",
    }),
    quantity: z.coerce.number().min(1, {
      message: "Quantity must be at least 1.",
    }),
    notes: z.string(),
  });

  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      item_name: "",
      quantity: 0,
      notes: "",
    },
  });

  function onSubmit(data: any) {
    // TODO: Remove the hardcoded member_id
    if (!groceryList) {
      return;
    }
    data = {
      ...data,
      member_id: 1,
      grocery_list_id: groceryList?.id,
    };
    setAddItemLoading(true);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    apiService.post("/api/grocery-lists/add-item", data).then(() => {
      toast({
        title: "Success",
        description: "Item added successfully",
        variant: "success",
      });
      setAddingItem(false);
      fetchItems();
      setAddItemLoading(false);
    });
  }

  const toggleItem = (id: number) => {
    apiService
      .post(`/api/grocery-lists/toggle-item?item_id=${id}`)
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to update item, please refresh and try again.",
          variant: "destructive",
        });
      });
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteItem = (id: number) => {
    apiService
      .delete(`/api/grocery-lists/delete-item?item_id=${id}`)
      .then(() => {
        fetchItems();
        toast({
          title: "Success",
          description: "Item deleted successfully",
          variant: "success",
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to delete item, please refresh and try again.",
          variant: "destructive",
        });
      });
  };

  const deleteList = () => {
    if (!groceryList) {
      return;
    }
    onDelete(groceryList.id);
  };

  return (
    <>
      {isOpen && groceryList && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{groceryList.name}</DialogTitle>
              <p className="text-muted-foreground text-sm">
                Grocery list created on{" "}
                {new Date(groceryList.created_at).toLocaleString()}
              </p>
              <Separator className="my-3" />
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div>
                  {items?.length > 0 && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Requested by</TableHead>
                          <TableHead>Notes</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.item_name}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>
                              {item.member.first_name} {item.member.last_name}
                            </TableCell>
                            <TableCell className="break-words max-w-80">
                              {item.notes}
                            </TableCell>
                            <TableCell className="grid grid-cols-2">
                              <Checkbox
                                onClick={() => toggleItem(item.id)}
                                checked={item.completed}
                              />
                              <Trash2
                                size={16}
                                color="#ef4444"
                                className="cursor-pointer"
                                onClick={() => {
                                  deleteItem(item.id);
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                  {addingItem && (
                    <>
                      <Separator className="my-3" />
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="w-full space-y-3"
                        >
                          <FormField
                            control={form.control}
                            name="item_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ex: Apples" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ex: 2" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Notes</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ex: Costco" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="mt-4 gap-3 flex">
                            <Button
                              type="submit"
                              variant="secondary"
                              disabled={addItemLoading}
                            >
                              Submit item
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => setAddingItem(false)}
                              disabled={addItemLoading}
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </>
                  )}
                  <div className="flex gap-3">
                    {!addingItem && (
                      <Button
                        onClick={() => setAddingItem(true)}
                        className="mt-2"
                      >
                        Add new item
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={deleteList}
                      className="mt-2"
                    >
                      Delete grocery list
                    </Button>
                  </div>
                </div>
              )}
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
