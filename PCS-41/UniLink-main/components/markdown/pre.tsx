import { Maximize2 } from "lucide-react";
import { ComponentProps, useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import Copy from "./copy";

export default function Pre({
  children,
  raw,
  filename,
  ...rest
}: ComponentProps<"pre"> & { raw?: string; filename?: string }) {
  const [showMaximize, setShowMaximize] = useState(false);

  return (
    <div className=" relative bg-muted/20 rounded w-[550px]  border mx-auto ">
      <div className="text-sm px-3 py-1 border-b bg-muted/20 rounded-t flex items-center justify-between">
        {filename}
        <div className="ml-auto flex gap-2">
          <div
            className="border w-6 h-6 flex items-center justify-center rounded cursor-pointer hover:bg-muted transition-all duration-200"
            onClick={() => setShowMaximize(true)}
          >
            <Maximize2 className="w-3 h-3 text-muted-foreground" />
          </div>
          <Copy content={raw!} fileName={filename} />
        </div>
      </div>
      <div className="overflow-x-auto p-2">
        <pre {...rest}>{children}</pre>
      </div>

      <Dialog open={showMaximize} onOpenChange={setShowMaximize}>
        <DialogContent className="max-w-3xl border p-0">
          <div className="max-h-[80vh] overflow-auto text-sm whitespace-pre-wrap px-3 py-2">
            <pre {...rest}>{children}</pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
