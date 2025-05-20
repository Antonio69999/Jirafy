import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useColorThemeStore } from "@/store/colorThemeStore";

// Move schema inside the component to access the translation function
export function PasswordChangeForm() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { colorTheme } = useColorThemeStore();

  // Define schema here so it can access the t function
  const passwordSchema = z
    .object({
      currentPassword: z.string().min(1, {
        message:
          t("settings.account.password.required") ||
          "Current password is required",
      }),
      newPassword: z
        .string()
        .min(8, {
          message: t("settings.account.password.minimumLength"),
        })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
          message:
            t("settings.account.password.requirements") ||
            "Password must include uppercase, lowercase and numbers",
        }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message:
        t("settings.account.password.mismatch") || "Passwords don't match",
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof passwordSchema>) {
    setIsLoading(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success(t("settings.account.password.success"), {
        description: t("settings.account.password.description"),
      });

      form.reset();
      setIsLoading(false);
    }, 1000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("settings.account.password.current")}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className={`theme-${colorTheme} focus-visible:border-[var(--primary)] focus-visible:ring-[var(--primary)]/30`}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("settings.account.password.new")}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className={`theme-${colorTheme} focus-visible:border-[var(--primary)] focus-visible:ring-[var(--primary)]/30`}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t("settings.account.password.minimumLength")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("settings.account.password.confirm")}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className={`theme-${colorTheme} focus-visible:border-[var(--primary)] focus-visible:ring-[var(--primary)]/30`}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className={`theme-${colorTheme} bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90 focus-visible:ring-[var(--primary)]/30`}
        >
          {isLoading
            ? t("settings.account.password.change")
            : t("settings.account.password.change")}
        </Button>
      </form>
    </Form>
  );
}
