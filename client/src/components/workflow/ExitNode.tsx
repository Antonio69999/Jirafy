import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExitNodeProps {
  data: {
    label: string;
  };
}

function ExitNode({ data }: ExitNodeProps) {
  return (
    <div
      className={cn(
        "px-4 py-3 rounded-lg border-2 transition-all min-w-[180px]",
        "bg-gradient-to-r from-purple-500/10 to-purple-600/10",
        "border-purple-500"
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-purple-500"
      />
      <div className="flex items-center gap-2 justify-center">
        <CheckCircle2 className="w-5 h-5 text-purple-500" />
        <div className="font-semibold text-purple-700 dark:text-purple-400">
          {data.label}
        </div>
      </div>
      <div className="text-xs text-center text-muted-foreground mt-1">
        Point de sortie
      </div>
    </div>
  );
}

export default memo(ExitNode);
