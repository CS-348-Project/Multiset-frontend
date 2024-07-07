import {
    BellIcon
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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

    const read = () => {
        apiService.patch("api/notifications/read")
            .then(() => {
                setNotifications(currentNotifs => currentNotifs.map(notif => ({ ...notif, read: true })));
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const clear = () => {
        apiService.delete("api/notifications/")
            .then(() => {
                setNotifications([]);
            })
            .catch((error) => {
                console.error(error);
            });
    }

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
            {
                notifications.length > 0 ? (
                    <DropdownMenuContent align="end">
                        {notifications.map((notification) => (
                            <DropdownMenuItem key={notification.id} className="flex flex-col items-end">
                                <div className={`block ${notification.read ? "" : "font-bold"}`}>{notification.message}</div>
                                <div className="text-xs text-dusk block">{notification.created_at}</div>
                            </DropdownMenuItem>
                        ))}

                        <div className="flex flex-rows">
                            <Button variant="ghost" className="text-primary flex-grow" onClick={read}>
                                Mark all as read
                            </Button>

                            <Button variant="ghost" className="text-primary flex-grow" onClick={clear}>
                                Clear all
                            </Button>
                        </div>
                    </DropdownMenuContent>
                )
                    : (
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-center">
                                You have no notifications
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    )
            }
        </DropdownMenu>
    )
};

export default NotificationDropdown;