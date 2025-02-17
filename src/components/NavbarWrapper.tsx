"use client";

import { UserButton } from "@clerk/nextjs";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";

// Add the Notification type
type Notification = {
  id: string;
  type: "like" | "comment" | "follow" | "mention";
  content: string;
  createdAt: Date;
  read: boolean;
};

function NotificationItem({ notification }: { notification: Notification }) {
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "like":
        return <HeartIcon />;
      case "comment":
        return <CommentIcon />;
      case "follow":
        return <UserIcon />;
      case "mention":
        return <AtIcon />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`hover:bg-muted flex items-start gap-3 rounded-lg p-3 transition-colors ${
        !notification.read ? "bg-muted/50" : ""
      }`}
    >
      <div className="mt-1 text-primary">
        {getNotificationIcon(notification.type)}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm">{notification.content}</p>
        <span className="text-muted-foreground text-xs">
          {new Date(notification.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}

const HeartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const CommentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const AtIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
  </svg>
);

export function NavbarWrapper() {
  const [searchInput, setSearchInput] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const pathname = usePathname();

  // Mock notifications data - replace with actual data from your database
  const mockNotifications: Notification[] = [
    {
      id: "1",
      type: "like",
      content: "John Doe liked your post",
      createdAt: new Date(),
      read: false,
    },
    {
      id: "2",
      type: "comment",
      content: "Jane Smith commented on your post",
      createdAt: new Date(),
      read: true,
    },
    {
      id: "3",
      type: "follow",
      content: "Alex Johnson started following you",
      createdAt: new Date(),
      read: false,
    },
  ];

  if (pathname === "/" || pathname === "/sign-in") return null;

  return (
    <nav className="relative flex h-32 flex-col items-center justify-center gap-4 px-12 py-4 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-gradient-to-r after:from-primary after:to-secondary md:h-20">
      <div className="flex w-full justify-between">
        <div className="w-[164px]">
          <NexaSVG />
        </div>
        <SearchInput
          mediaQuery="hidden md:flex"
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />
        <div className="flex w-[164px] items-center justify-end gap-4">
          <Link href="/">
            <HomeIconSVG />
          </Link>
          <Link href="/search">
            <SearchIconSVG />
          </Link>
          <PopoverPrimitive.Root
            open={isNotificationsOpen}
            onOpenChange={setIsNotificationsOpen}
          >
            <PopoverPrimitive.Trigger asChild>
              <button className="relative">
                <BellIconSVG />
                {mockNotifications.some((n) => !n.read) && (
                  <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary" />
                )}
              </button>
            </PopoverPrimitive.Trigger>
            <PopoverPrimitive.Portal>
              <PopoverPrimitive.Content
                align="end"
                sideOffset={8}
                className={cn(
                  "z-50 w-80 rounded-lg border bg-background p-4 shadow-md outline-none",
                  "data-[state=open]:animate-in data-[state=closed]:animate-out",
                  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                  "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                  "data-[side=bottom]:slide-in-from-top-2",
                  "data-[side=top]:slide-in-from-bottom-2",
                )}
              >
                <div className="flex flex-col gap-4">
                  <h2 className="text-lg font-semibold text-primary">
                    Notifications
                  </h2>
                  <ScrollArea className="h-[min(60vh,400px)]">
                    {mockNotifications.length === 0 ? (
                      <p className="text-muted-foreground text-center text-sm">
                        No notifications yet
                      </p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {mockNotifications.map((notification) => (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                          />
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
                <PopoverPrimitive.Arrow className="fill-border" />
              </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
          </PopoverPrimitive.Root>
          <Link href="/settings">
            <SettingsIconSVG />
          </Link>
          <UserButton />
        </div>
      </div>
      <SearchInput
        mediaQuery="md:hidden"
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
    </nav>
  );
}

const SearchInput = ({
  mediaQuery,
  searchInput,
  setSearchInput,
}: {
  mediaQuery: string;
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const router = useRouter();
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${searchInput}`);
    console.log("searchInput", searchInput);
  };
  return (
    <div className={cn("relative w-full md:w-96", mediaQuery)}>
      <form
        onSubmit={handleSearchSubmit}
        className="flex w-full flex-col items-center justify-center gap-2"
      >
        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary to-secondary"></div>
        <Input
          placeholder="Search"
          className="relative m-[1px] w-[calc(100%-2px)] bg-background"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </form>
    </div>
  );
};

const HomeIconSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="33"
      height="25"
      viewBox="0 0 33 25"
      fill="none"
    >
      <path
        d="M16.0112 6.48566L5.48289 14.9604V24.107C5.48289 24.3439 5.57915 24.571 5.7505 24.7385C5.92184 24.9059 6.15424 25 6.39656 25L12.7957 24.9838C13.0372 24.9826 13.2684 24.888 13.4388 24.7207C13.6092 24.5534 13.7048 24.3269 13.7048 24.0909V18.7493C13.7048 18.5125 13.8011 18.2853 13.9724 18.1179C14.1438 17.9504 14.3761 17.8563 14.6185 17.8563H18.2732C18.5155 17.8563 18.7479 17.9504 18.9192 18.1179C19.0906 18.2853 19.1868 18.5125 19.1868 18.7493V24.087C19.1865 24.2045 19.2098 24.3209 19.2556 24.4295C19.3013 24.5382 19.3686 24.637 19.4534 24.7202C19.5383 24.8034 19.6392 24.8694 19.7502 24.9145C19.8612 24.9595 19.9803 24.9827 20.1005 24.9827L26.4974 25C26.7397 25 26.9721 24.9059 27.1434 24.7385C27.3148 24.571 27.411 24.3439 27.411 24.107V14.9542L16.885 6.48566C16.7612 6.38817 16.607 6.33501 16.4481 6.33501C16.2892 6.33501 16.135 6.38817 16.0112 6.48566ZM32.6418 12.2458L27.8679 8.39993V0.669718C27.8679 0.492097 27.7957 0.321752 27.6672 0.196156C27.5386 0.0705595 27.3643 0 27.1826 0H23.9848C23.803 0 23.6287 0.0705595 23.5002 0.196156C23.3717 0.321752 23.2995 0.492097 23.2995 0.669718V4.72207L18.1869 0.611117C17.6963 0.21653 17.0806 0.000788785 16.4452 0.000788785C15.8098 0.000788785 15.1942 0.21653 14.7036 0.611117L0.248689 12.2458C0.1793 12.3018 0.121892 12.3707 0.0797441 12.4484C0.0375964 12.5262 0.0115355 12.6113 0.00305061 12.6989C-0.00543432 12.7865 0.00382295 12.8748 0.0302935 12.9589C0.0567641 13.043 0.0999291 13.1212 0.157322 13.189L1.61349 14.9191C1.67072 14.9871 1.74113 15.0434 1.82066 15.0848C1.9002 15.1262 1.98731 15.1519 2.077 15.1603C2.16669 15.1688 2.25721 15.1598 2.34337 15.1341C2.42954 15.1083 2.50965 15.0661 2.57913 15.01L16.0112 4.19746C16.135 4.09997 16.2892 4.04681 16.4481 4.04681C16.607 4.04681 16.7612 4.09997 16.885 4.19746L30.3176 15.01C30.387 15.0661 30.467 15.1083 30.553 15.1342C30.6391 15.1601 30.7295 15.1691 30.8191 15.1608C30.9087 15.1525 30.9958 15.1271 31.0754 15.0859C31.1549 15.0447 31.2254 14.9886 31.2827 14.9208L32.7389 13.1906C32.7962 13.1225 32.8392 13.0439 32.8654 12.9594C32.8915 12.875 32.9003 12.7863 32.8913 12.6985C32.8823 12.6107 32.8556 12.5255 32.8128 12.4478C32.77 12.3701 32.7119 12.3015 32.6418 12.2458Z"
        fill="#EB5E28"
      />
    </svg>
  );
};

const SearchIconSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
    >
      <path
        d="M24.6582 21.6162L19.79 16.748C19.5703 16.5283 19.2725 16.4062 18.96 16.4062H18.1641C19.5117 14.6826 20.3125 12.5146 20.3125 10.1562C20.3125 4.5459 15.7666 0 10.1562 0C4.5459 0 0 4.5459 0 10.1562C0 15.7666 4.5459 20.3125 10.1562 20.3125C12.5146 20.3125 14.6826 19.5117 16.4062 18.1641V18.96C16.4062 19.2725 16.5283 19.5703 16.748 19.79L21.6162 24.6582C22.0752 25.1172 22.8174 25.1172 23.2715 24.6582L24.6533 23.2764C25.1123 22.8174 25.1123 22.0752 24.6582 21.6162ZM10.1562 16.4062C6.7041 16.4062 3.90625 13.6133 3.90625 10.1562C3.90625 6.7041 6.69922 3.90625 10.1562 3.90625C13.6084 3.90625 16.4062 6.69922 16.4062 10.1562C16.4062 13.6084 13.6133 16.4062 10.1562 16.4062Z"
        fill="#EB5E28"
      />
    </svg>
  );
};

const BellIconSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="25"
      viewBox="0 0 22 25"
      fill="none"
    >
      <path
        d="M11 25C12.7345 25 14.1414 23.6011 14.1414 21.875H7.85863C7.85863 23.6011 9.26554 25 11 25ZM21.5772 17.6899C20.6284 16.6763 18.8532 15.1514 18.8532 10.1562C18.8532 6.3623 16.1778 3.3252 12.5704 2.58008V1.5625C12.5704 0.699707 11.8672 0 11 0C10.1328 0 9.42956 0.699707 9.42956 1.5625V2.58008C5.82216 3.3252 3.14681 6.3623 3.14681 10.1562C3.14681 15.1514 1.37159 16.6763 0.422845 17.6899C0.128203 18.0049 -0.0024214 18.3813 3.3952e-05 18.75C0.00543572 19.5508 0.637443 20.3125 1.57637 20.3125H20.4236C21.3626 20.3125 21.9951 19.5508 22 18.75C22.0024 18.3813 21.8718 18.0044 21.5772 17.6899Z"
        fill="#EB5E28"
      />
    </svg>
  );
};

const SettingsIconSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
    >
      <path
        d="M22.8885 15.0196L20.8084 13.8184C21.0184 12.6856 21.0184 11.5235 20.8084 10.3907L22.8885 9.1895C23.1277 9.05278 23.2352 8.76958 23.157 8.50591C22.615 6.76762 21.6922 5.19536 20.4861 3.88676C20.3006 3.68657 19.9979 3.63774 19.7635 3.77446L17.6834 4.97563C16.8094 4.22368 15.8035 3.64262 14.7147 3.26176V0.864303C14.7147 0.590866 14.5242 0.351608 14.2557 0.293015C12.4637 -0.107376 10.6277 -0.0878449 8.92364 0.293015C8.65508 0.351608 8.46465 0.590866 8.46465 0.864303V3.26665C7.38067 3.65239 6.37481 4.23344 5.4959 4.98051L3.42071 3.77934C3.18145 3.64262 2.8836 3.68657 2.69805 3.89165C1.492 5.19536 0.569146 6.76762 0.0271543 8.51079C-0.0558535 8.77446 0.0564511 9.05766 0.295709 9.19438L2.37579 10.3956C2.16583 11.5284 2.16583 12.6905 2.37579 13.8233L0.295709 15.0245C0.0564511 15.1612 -0.0509707 15.4444 0.0271543 15.7081C0.569146 17.4463 1.492 19.0186 2.69805 20.3272C2.8836 20.5274 3.18633 20.5762 3.42071 20.4395L5.50079 19.2383C6.37481 19.9903 7.38067 20.5713 8.46954 20.9522V23.3545C8.46954 23.628 8.65997 23.8672 8.92852 23.9258C10.7205 24.3262 12.5565 24.3067 14.2606 23.9258C14.5291 23.8672 14.7195 23.628 14.7195 23.3545V20.9522C15.8035 20.5665 16.8094 19.9854 17.6883 19.2383L19.7684 20.4395C20.0076 20.5762 20.3055 20.5323 20.491 20.3272C21.6971 19.0235 22.6199 17.4512 23.1619 15.7081C23.2352 15.4395 23.1277 15.1563 22.8885 15.0196ZM11.5897 16.0108C9.43633 16.0108 7.6834 14.2579 7.6834 12.1045C7.6834 9.95122 9.43633 8.19829 11.5897 8.19829C13.743 8.19829 15.4959 9.95122 15.4959 12.1045C15.4959 14.2579 13.743 16.0108 11.5897 16.0108Z"
        fill="#EB5E28"
      />
    </svg>
  );
};

const NexaSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="41"
      height="40"
      viewBox="0 0 41 40"
      fill="none"
    >
      <path
        d="M25.945 17.348C25.6747 17.043 23.7246 15.0515 21.6115 12.9224C16.5711 7.84392 12.4841 3.58998 11.8052 2.71545C11.5472 2.38306 12.0094 2.07644 13.825 1.37555C17.6656 -0.107021 21.3612 -0.384519 25.3398 0.510924L26.5971 0.793896L26.6091 4.02965C26.6535 15.9409 26.6442 17.9049 26.5436 17.9037C26.4847 17.9029 26.2154 17.6529 25.945 17.348Z"
        fill="#EB5E28"
      />
      <path
        d="M31.7435 23.5108L28.8722 20.6473L28.8241 11.1243C28.7976 5.88665 28.8131 1.60132 28.8585 1.60132C29.0382 1.60132 31.1615 3.03651 32.5578 4.10174C33.3695 4.72094 34.178 5.29615 34.3545 5.37999L34.6755 5.53243V15.9534C34.6755 21.6849 34.6619 26.3744 34.6451 26.3744C34.6284 26.3744 33.3227 25.0858 31.7435 23.5108Z"
        fill="#EB5E28"
      />
      <path
        d="M4.37764 30.9431C0.686394 25.5516 -0.151207 18.7103 2.1808 13C2.57493 12.0349 4.51525 8.69471 4.68181 8.69458C4.84065 8.69445 4.93063 27.4542 4.78472 30.1491L4.71504 31.4359L4.37764 30.9431Z"
        fill="#EB5E28"
      />
      <path
        d="M36.8924 20.0487C36.8632 8.97772 36.8694 8.54571 37.0529 8.79664C37.1579 8.94016 37.4426 9.32129 37.6856 9.64358C41.5 14.7032 41.9404 22.6132 38.7684 29.0906C38.3957 29.8515 37.1367 31.5625 36.9498 31.5618C36.9349 31.5618 36.9091 26.3809 36.8924 20.0487Z"
        fill="#EB5E28"
      />
      <path
        d="M30.6846 34.6587C29.1008 33.0947 27.0916 31.0433 25.3652 29.2277C24.9527 28.7939 23.3143 27.105 21.7244 25.4746C18.799 22.4749 17.5905 21.201 13.4355 16.7365C12.1702 15.377 10.196 13.328 9.04844 12.1832L6.96191 10.1018L6.99265 7.82371L7.02338 5.54562L7.79516 4.8891C8.21964 4.52801 8.7114 4.04772 8.88795 3.8218C9.28088 3.31899 9.31214 3.31594 9.67015 3.7453C9.82794 3.93454 10.2647 4.37521 10.6408 4.72457C11.0168 5.07394 11.6382 5.71709 12.0217 6.15379C12.8401 7.08589 18.2653 12.7218 21.1935 15.6819C23.293 17.8043 24.9929 19.6087 26.3796 21.187C26.8145 21.6819 28.4072 23.3494 29.919 24.8924C31.4308 26.4354 32.9269 27.9865 33.2436 28.3392C33.5602 28.6919 34.024 29.1619 34.2741 29.3837L34.7289 29.7869V32.1867V34.5866L34.3811 34.7882C33.8709 35.0841 32.7166 36.0141 32.6516 36.1816C32.5447 36.4572 32.3645 36.3177 30.6846 34.6587Z"
        fill="#EB5E28"
      />
      <path
        d="M12.1598 37.8553C11.112 37.2988 9.55095 36.2799 8.4053 35.405C7.96322 35.0673 7.49016 34.7193 7.35405 34.6317L7.10657 34.4723L7.11444 24.1166C7.12297 12.9153 7.13244 12.6857 7.55258 13.4625C7.6167 13.581 8.18573 14.2164 8.81712 14.8745C9.90417 16.0075 12.3603 18.7622 12.8809 19.4324L13.1215 19.7421L13.1089 29.0399C13.102 34.1536 13.0884 38.3368 13.0787 38.3359C13.069 38.3351 12.6555 38.1187 12.1598 37.8553Z"
        fill="#EB5E28"
      />
      <path
        d="M18.8394 39.8755C17.7325 39.7254 15.6645 39.2995 15.5559 39.1993C15.4369 39.0895 15.3305 28.488 15.4156 25.222L15.494 22.2168L15.7731 22.5753C15.9266 22.7725 17.5489 24.4584 19.3781 26.3216C23.0685 30.0808 24.7399 31.8228 26.8414 34.1005C28.5612 35.9644 29.4199 36.828 29.9123 37.189C30.5075 37.6253 30.4058 37.6981 27.8694 38.652C24.8338 39.7936 21.5333 40.2408 18.8394 39.8755Z"
        fill="#EB5E28"
      />
    </svg>
  );
};
