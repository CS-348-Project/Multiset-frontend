import { apiService } from "@/utils/api";
import { Group } from "@/types/Group";
import { toast } from "@/components/ui/use-toast";

type SettingsToggleProps = {
  group: Group;
  setGroup: React.Dispatch<React.SetStateAction<Group>>;
};

export const SettingsToggle: React.FC<SettingsToggleProps> = ({
  group,
  setGroup,
}) => {
  const handleOptimizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = parseInt(e.currentTarget.getAttribute("data-group-id")!);
    const newGroup = {
      ...group,
      optimize_payments: !group.optimize_payments,
    };

    setGroup((p) => ({
      ...p,
      optimize_payments: !group.optimize_payments,
    }));

    // try to toggle the optimization setting
    apiService
      .patch(`/api/optimization/toggle?group_id=${id}`)
      .then(() => {})
      // if it fails, revert the state and show an alert
      .catch((err) => {
        setGroup((p) => ({
          ...p,
          optimize_payments: !group.optimize_payments,
        }));

        setGroup(newGroup);

        console.error(err);
        toast({
          variant: "destructive",
          description: (
            <p>
              Failed to toggle optimization settings. Please try again later.
            </p>
          ),
        });
      });
  };

  return (
    <div className="mr-10">
      {group ? (
        <div key={group.id} className="bg-white shadow-md rounded-lg p-5">
          <h3 className="font-semibold text-black text-lg">{group.name}</h3>
          <div className="flex justify-between items-center mt-5">
            <p className="text-black text-sm md:text-base">Optimize Payments</p>

            <div className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
                checked={group.optimize_payments}
                data-group-id={group.id}
                onChange={handleOptimizationChange}
              />
              <p className="text-black text-sm md:text-base ml-2">
                {group.optimize_payments ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-black text-sm md:text-base mt-5">Loading...</p>
      )}
    </div>
  );
};

export default SettingsToggle;
