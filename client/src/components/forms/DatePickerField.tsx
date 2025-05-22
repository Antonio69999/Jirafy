import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { useTranslation } from "react-i18next";

interface DatePickerFieldProps {
  value?: Date;
  onChange: (date?: Date) => void;
  label: string;
  placeholder?: string;
  error?: string;
}

export function DatePickerField({
  value,
  onChange,
  label,
  placeholder,
  error,
}: DatePickerFieldProps) {
  const { t } = useTranslation();
  const { colorTheme } = useColorThemeStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (date?: Date) => {
    onChange(date);
    setIsOpen(false);
  };

  return (
    <FormItem className="flex flex-col">
      <FormLabel>{label}</FormLabel>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <FormControl>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-full pl-3 text-left font-normal",
                !value && "text-muted-foreground",
                `focus-visible:ring-[var(--theme-primary)] focus-visible:border-[var(--theme-primary)] hover:border-[var(--hover-border)]`
              )}
            >
              {value ? (
                format(value, "PPP", { locale: fr })
              ) : (
                <span>
                  {placeholder ||
                    t("dashboard.addTask.pickDate") ||
                    "Pick a date"}
                </span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="p-0 bg-background"
          sideOffset={4}
          side="bottom"
        >
          <div className="p-3">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleSelect}
              initialFocus
              className={cn(`theme-${colorTheme}`)}
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
}
