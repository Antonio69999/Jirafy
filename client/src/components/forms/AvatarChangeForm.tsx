import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useColorThemeStore } from "@/store/colorThemeStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";

export function AvatarChangeForm() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { colorTheme } = useColorThemeStore();
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview the image
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      // Preview the image
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview) return;

    setIsLoading(true);

    // Simulate upload process
    setTimeout(() => {
      toast.success(t("settings.account.avatar.success") || "Avatar updated", {
        description:
          t("settings.account.avatar.success_description") ||
          "Your profile picture has been updated successfully.",
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleCancel = () => {
    setPreview(null);
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">
        {t("settings.account.avatar.title") || "Profile Picture"}
      </h3>

      <div className="flex items-start gap-6 mb-6">
        <div>
          <Avatar className="h-24 w-24">
            <AvatarImage src="https://placehold.co/55x55/?text=PP" />
            <AvatarFallback className="text-xl bg-muted"></AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-4">
            {t("settings.account.avatar.description") ||
              "Upload a profile picture to personalize your account."}
          </p>

          <div
            className={`border-2 border-dashed rounded-lg p-6 mb-4 transition-colors text-center ${
              isDragging
                ? `border-[var(--primary)] bg-[var(--primary)]/5`
                : "border-muted-foreground/20"
            } ${preview ? "hidden" : "block"}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium">
              {t("settings.account.avatar.dropzone") ||
                "Drop your image here, or"}
            </p>
            <Label
              htmlFor="avatar-upload"
              className={`text-sm cursor-pointer text-[var(--primary)] hover:underline mt-1 inline-block`}
            >
              {t("settings.account.avatar.browse") || "browse"}
            </Label>
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {preview && (
            <div className="flex gap-2">
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className={`theme-${colorTheme} bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90 focus-visible:ring-[var(--primary)]/30`}
              >
                {isLoading
                  ? t("settings.account.avatar.uploading") || "Uploading..."
                  : t("settings.account.avatar.save") || "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="gap-1"
              >
                <X className="h-4 w-4" />
                {t("settings.account.avatar.cancel") || "Cancel"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
