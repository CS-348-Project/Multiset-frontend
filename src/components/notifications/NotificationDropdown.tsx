import {
    BellIcon
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown";

import { apiService } from "@/utils/api";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Notification } from "@/types/Notification";

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        apiService
            .get("api/notifications/")
            .then((response) => {
                console.log(response.data);
                setNotifications(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className=" w-8 h-8"
                >
                    <BellIcon className="w-4 h-4" />
                    <span className="sr-only">Toggle user menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="flex flex-col items-end">
                        <div className={`block ${notification.read ? "" : "font-bold"}`}>{notification.message}</div>
                        <div className="text-xs text-dusk block">{notification.created_at}</div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
};

export default NotificationDropdown;