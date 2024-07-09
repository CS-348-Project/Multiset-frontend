import { GroceryListForm } from "@/components/groceryList/GroceryListForm";
import { TGroceryList } from "@/components/groceryList/types/GroceryListTypes";
import DefaultLayout from "@/components/layout/default-layout";
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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { apiService } from "@/utils/api";
import { timeConverter } from "@/utils/timeConverter";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";

export const GroceryList = () => {
  const [groceryLists, setGroceryLists] = React.useState<TGroceryList[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedGroceryList, setSelectedGroceryList] =
    React.useState<TGroceryList | null>(null);
  const [addingList, setAddingList] = React.useState(false);
  const [addingListLoading, setAddListLoading] = React.useState(false);

  const params = useParams<{ id: string }>();
  const group_id = Number(params.id);

  const handleListOpen = (id: number) => {
    setIsFormOpen(true);
    setSelectedGroceryList(groceryLists.find((list) => list.id === id) ?? null);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedGroceryList(null);
  };

  const fetchLists = () => {
    return apiService
      .get("/api/grocery-lists", { params: { group_id } })
      .then((response) => {
        setGroceryLists(response.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const deleteList = (id: number) => {
    // TODO: Add confirm dialog but i'm too burnt out to do it rn
    setLoading(true);
    setIsFormOpen(false);
    setSelectedGroceryList(null);
    apiService
      .delete(`/api/grocery-lists/delete?id=${id}`)
      .then(() => {
        toast({
          title: "Success",
          description: "List deleted successfully",
          variant: "success",
        });
        fetchLists();
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to delete list",
          variant: "destructive",
        });
      });
  };

  const GroceryListCard = ({ groceryList }: { groceryList: TGroceryList }) => {
    return (
      <div
        className="bg-white p-4 my-4 rounded-lg border-solid border-secondary outline-1 border cursor-pointer hover:bg-secondary transition-all duration-150"
        onClick={() => handleListOpen(groceryList.id)}
      >
        <h2 className="font-semibold text-black text-xl">{groceryList.name}</h2>
        <h2 className="text-muted-foreground">
          Created on {timeConverter(groceryList.created_at)}
        </h2>
      </div>
    );
  };

  const FormSchema = z.object({
    name: z.string().min(2, {
      message: "List name must be at least 2 characters.",
    }),
  });

  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(data: any) {
    data = {
      ...data,
      group_id,
    };
    setAddListLoading(true);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    apiService.post("/api/grocery-lists/create", data).then((response) => {
      console.log(response.data);
      toast({
        title: "Success",
        description: "Item added successfully",
        variant: "success",
      });
      setAddingList(false);
      setAddListLoading(false);
      fetchLists().then(() => {
        const newGroceryList: TGroceryList | null =
          groceryLists.find((list) => list.id === response.data.id) ?? null;
        if (newGroceryList) {
          setIsFormOpen(true);
          setSelectedGroceryList(newGroceryList);
        }
      });
    });
  }

  return (
    <DefaultLayout>
      <div className="w-full">
        <h1 className="font-semibold text-black text-2xl md:text-3xl lg:text-4xl my-10">
          Grocery Lists
        </h1>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            {addingList && (
              <>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-3"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Party Night" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="mt-4 gap-3 flex">
                      <Button
                        type="submit"
                        variant="secondary"
                        disabled={addingListLoading}
                      >
                        Create List
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setAddingList(false)}
                        disabled={addingListLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
                <Separator className="my-3" />
              </>
            )}
            {!addingList && (
              <Button onClick={() => setAddingList(true)}>
                Add new grocery list
              </Button>
            )}
            {groceryLists.map((groceryList: TGroceryList) => {
              return (
                <GroceryListCard
                  key={groceryList.id}
                  groceryList={groceryList}
                />
              );
            })}
          </div>
        )}
      </div>

      <GroceryListForm
        isOpen={isFormOpen}
        groceryList={selectedGroceryList}
        onClose={closeForm}
        onDelete={deleteList}
      />
    </DefaultLayout>
  );
};
