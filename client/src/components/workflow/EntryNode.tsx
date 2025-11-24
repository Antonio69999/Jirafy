import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EntryNodeProps {
  data: {
    label: string;
  };
}

function EntryNode({ data }: EntryNodeProps) {
  return (
    <div
      className={cn(
        "px-4 py-3 rounded-lg border-2 transition-all min-w-[180px]",
        "bg-gradient-to-r from-green-500/10 to-green-600/10",
        "border-green-500"
      )}
    >
      <div className="flex items-center gap-2 justify-center">
        <PlayCircle className="w-5 h-5 text-green-500" />
        <div className="font-semibold text-green-700 dark:text-green-400">
          {data.label}
        </div>
      </div>
      <div className="text-xs text-center text-muted-foreground mt-1">
        Point d'entrée
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500"
      />
    </div>
  );
}

export default memo(EntryNode);
