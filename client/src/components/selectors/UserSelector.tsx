import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface UserType {
  id: string;
  name: string;
  avatar?: string;
}

interface UserSelectorProps {
  selectedUsers: UserType[];
  onUsersChange: (users: UserType[]) => void;
  availableUsers: UserType[];
  label: string;
  error?: string;
  maxUsers?: number;
}

export function UserSelector({
  selectedUsers,
  onUsersChange,
  availableUsers,
  label,
  error,
  maxUsers,
}: UserSelectorProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const addUser = (user: UserType) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      const updated = [...selectedUsers, user];
      onUsersChange(updated);
    }
  };

  const removeUser = (userId: string) => {
    const updated = selectedUsers.filter((user) => user.id !== userId);
    onUsersChange(updated);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="flex flex-wrap gap-1 mb-2">
        {selectedUsers.map((user) => (
          <Badge
            key={user.id}
            variant="outline"
            className="p-1 pl-1 pr-2 flex items-center gap-1 bg-background"
            onClick={() => removeUser(user.id)}
          >
            <Avatar className="h-5 w-5">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-[8px]">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <span>{user.name}</span>
            <span className="ml-1 cursor-pointer">×</span>
          </Badge>
        ))}
      </div>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <FormControl>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              className={cn(
                "w-full justify-between",
                !selectedUsers.length && "text-muted-foreground",
                `focus-visible:ring-[var(--theme-primary)] focus-visible:border-[var(--theme-primary)] hover:border-[var(--hover-border)]`
              )}
            >
              <span>
                {t("dashboard.addTask.addAssignees") || "Add assignees"}
              </span>
              <User className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="p-0 bg-background"
          sideOffset={4}
          side="bottom"
        >
          <div className="p-2">
            {availableUsers.map((user) => (
              <button
                key={user.id}
                type="button"
                className={cn(
                  "flex items-center w-full p-2 rounded-md cursor-pointer hover:bg-muted text-left",
                  selectedUsers.some((u) => u.id === user.id) && "bg-muted"
                )}
                onClick={() => {
                  addUser(user);
                  setIsOpen(false);
                }}
              >
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-[10px]">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
              </button>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
}
