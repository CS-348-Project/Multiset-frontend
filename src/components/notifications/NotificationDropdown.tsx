import { BellIcon } from "lucide-react";
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
  const [unread, setUnread] = useState<number>(0);

  useEffect(() => {
    apiService
      .get("api/notifications/")
      .then((response) => {
        setNotifications(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    setUnread(notifications.filter((notif) => !notif.read).length);
  }, [notifications]);

  const read = () => {
    apiService
      .patch("api/notifications/read")
      .then(() => {
        setNotifications((currentNotifs) =>
          currentNotifs.map((notif) => ({ ...notif, read: true }))
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const clear = () => {
    apiService
      .delete("api/notifications/")
      .then(() => {
        setNotifications([]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getTime = (date: string) => {
    const notifDate = new Date(`${date}Z`);

    const currentDate = new Date();

    const diff = currentDate.getTime() - notifDate.getTime();

    // see if the difference is less than 1 day
    if (diff < 60000) {
      // 60 * 1000
      return "Just now";
    }
    if (diff < 3600000) {
      // 60 * 60 * 1000
      const minutes = Math.floor(diff / 60000);

      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }

    if (diff < 86400000) {
      // 24 * 60 * 60 * 1000
      const hours = Math.floor(diff / 3600000);

      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }

    //otherwise, see if the difference is less than 1 week
    const days = Math.floor(diff / 86400000);

    if (days === 1) {
      return "Yesterday";
    }

    if (days < 7) {
      return `${days} days ago`;
    }

    // if it's not, try to see if it's less than 4 weeks
    const weeks = Math.floor(days / 7);

    if (weeks === 1) {
      return "Last week";
    }

    if (weeks < 4) {
      return `${weeks} weeks ago`;
    }

    // if it's not, return the date

    if (notifDate.getFullYear() === currentDate.getFullYear()) {
      return notifDate.toLocaleDateString([], {
        month: "long",
        day: "numeric",
      });
    }

    return notifDate.toLocaleDateString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <DropdownMenu
      onOpenChange={(open: boolean) => {
        if (!open) {
          // if the dropdown is closing, mark all as read
          read();
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className=" w-8 h-8 relative">
          <BellIcon className="w-4 h-4" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          )}
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      {notifications?.length > 0 ? (
        <DropdownMenuContent align="end" className="bg-white">
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-end text-dusk"
              >
                <div
                  className={`block ${notification.read ? "" : "font-bold"}`}
                >
                  {notification.message}
                </div>
                <div className="text-xs text-dusk block">
                  {getTime(notification.created_at)}
                </div>
              </DropdownMenuItem>
            ))}
          </div>

          <DropdownMenuItem>
            <Button
              variant="ghost"
              className="text-primary flex-grow"
              onClick={clear}
            >
              Clear all
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      ) : (
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="text-center">
            You have no notifications
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};

export default NotificationDropdown;
