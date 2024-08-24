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
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import useIsMobile from "@/utils/windowSize";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState<number>(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    apiService
      .get("api/notifications/get")
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

  return !isMobile ? (
    <DropdownMenu
      onOpenChange={(open: boolean) => {
        if (!open) {
          // if the dropdown is closing, mark all as read
          read();
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-8 h-8 relative">
          <BellIcon className="w-4 h-4" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-3 h-3 bg-red rounded-full"></span>
          )}
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      {notifications?.length > 0 ? (
        <DropdownMenuContent align="end" className="bg-white pt-4">
          <div className="max-h-80 overflow-y-scroll w-full max-w-80 px-4 grid gap-2">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="text-black bg-grey rounded-3xl p-4 gap-1 grid"
              >
                <div
                  className={`block ${notification.read ? "" : "font-bold"}`}
                >
                  {notification.message}
                </div>
                <div className="text-xs font-extralight text-black block">
                  {getTime(notification.created_at)}
                </div>
              </DropdownMenuItem>
            ))}
          </div>

          <DropdownMenuItem>
            <Button variant="default" onClick={clear} className="ml-auto">
              Clear all
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      ) : (
        <DropdownMenuContent align="end" className="text-black p-2">
          <DropdownMenuItem className="text-center">
            You have no notifications
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  ) : (
    <Drawer
      onOpenChange={(open: boolean) => {
        if (!open) {
          // if the dropdown is closing, mark all as read
          read();
        }
      }}
    >
      <DrawerTrigger>
        <Button variant="ghost" size="icon" className="w-8 h-8 relative">
          <BellIcon className="w-4 h-4" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-3 h-3 bg-red rounded-full"></span>
          )}
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DrawerTrigger>
      {notifications?.length > 0 ? (
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Notifications</DrawerTitle>
          </DrawerHeader>
          <div className="max-h-80 overflow-y-scroll w-full px-4 grid gap-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex flex-col text-black bg-grey rounded-3xl p-4 gap-1"
              >
                <div
                  className={`block ${notification.read ? "" : "font-bold"}`}
                >
                  {notification.message}
                </div>
                <div className="text-xs font-extralight text-black block">
                  {getTime(notification.created_at)}
                </div>
              </div>
            ))}
          </div>

          <DrawerFooter>
            <Button variant="default" onClick={clear}>
              Clear all
            </Button>
          </DrawerFooter>
        </DrawerContent>
      ) : (
        <DrawerContent>
          <div className="text-center p-4">You have no notifications</div>
        </DrawerContent>
      )}
    </Drawer>
  );
};

export default NotificationDropdown;
