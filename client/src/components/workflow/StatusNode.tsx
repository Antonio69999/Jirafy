import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Circle, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusNodeProps {
  data: {
    name: string;
    key: string;
    category: string;
  };
  selected?: boolean;
}

const getCategoryColor = (category: string): string => {
  switch (category) {
    case "todo":
      return "#3b82f6"; // Bleu
    case "in_progress":
      return "#f59e0b"; // Orange
    case "done":
      return "#10b981"; // Vert
    default:
      return "#6b7280"; // Gris
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "todo":
      return <Circle className="w-4 h-4" />;
    case "in_progress":
      return <ArrowRight className="w-4 h-4" />;
    case "done":
      return <CheckCircle2 className="w-4 h-4" />;
    default:
      return <Circle className="w-4 h-4" />;
  }
};

const getCategoryLabel = (category: string): string => {
  switch (category) {
    case "todo":
      return "À faire";
    case "in_progress":
      return "En cours";
    case "done":
      return "Terminé";
    default:
      return "";
  }
};

function StatusNode({ data, selected }: StatusNodeProps) {
  const color = getCategoryColor(data.category);
  const icon = getCategoryIcon(data.category);
  const categoryLabel = getCategoryLabel(data.category);

  return (
    <div
      className={cn(
        "px-4 py-3 rounded-lg border-2 transition-all min-w-[180px]",
        "bg-card shadow-md",
        selected && "ring-2 ring-primary ring-offset-2"
      )}
      style={{ borderColor: color }}
    >
      <Handle type="target" position={Position.Left} className="opacity-0" />

      <div className="flex items-center gap-2 mb-1">
        <div style={{ color }}>{icon}</div>
        <div className="font-semibold text-foreground">{data.name}</div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{data.key}</div>
        <div
          className="text-xs font-medium px-2 py-0.5 rounded"
          style={{
            backgroundColor: `${color}20`,
            color: color,
          }}
        >
          {categoryLabel}
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="opacity-0" />
    </div>
  );
}

export default memo(StatusNode);
