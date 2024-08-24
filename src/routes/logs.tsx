import DefaultLayout from "@/components/layout/default-layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { TLog } from "@/types/Log";
import { apiService } from "@/utils/api";
import { timeConverter } from "@/utils/timeConverter";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
export const Logs = () => {
  const { toast } = useToast();
  const [logs, setLogs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const params = useParams<{ id: string }>();
  const group_id = Number(params.id);
  const fetchLogs = () => {
    setLoading(true);
    apiService
      .get("/api/member-activity-logs/get", {
        params: {
          group_id,
        },
      })
      .then((response) => {
        setLogs(response.data);
        setLoading(false);
      })
      .catch((e) => {
        toast({
          title: "Error",
          description: e.response.data.message,
          variant: "destructive",
        });
      });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <DefaultLayout>
      <div>
        <h1 className="font-semibold text-black text-2xl md:text-3xl lg:text-4xl my-10">
          Member Activity Logs
        </h1>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Action</TableHead>
                <TableHead className="w-[200px]">Details</TableHead>
                <TableHead className="w-[200px]">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4}>Loading...</TableCell>
                </TableRow>
              ) : (
                logs &&
                logs.map((log: TLog) => {
                  return (
                    <TableRow key={log.id}>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.details}</TableCell>
                      <TableCell>{timeConverter(log.created_at)}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DefaultLayout>
  );
};
