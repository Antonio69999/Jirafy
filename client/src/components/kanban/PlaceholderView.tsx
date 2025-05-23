import { useTranslation } from "react-i18next";

interface PlaceholderViewProps {
  title: string;
}

export function PlaceholderView({ title }: PlaceholderViewProps) {
  const { t } = useTranslation();

  return (
    <div className="px-1 pb-4">
      <div className="bg-card rounded-md border shadow-sm">
        <div className="p-3 border-b">
          <h3 className="font-medium">{title}</h3>
        </div>
        <div className="p-3">
          <p className="text-muted-foreground text-sm">
            {t("dashboard.tabInDevelopment") || `Vue ${title} en développement`}
          </p>
        </div>
      </div>
    </div>
  );
}
