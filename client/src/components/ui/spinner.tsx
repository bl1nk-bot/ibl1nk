// ponytail: UI primitive ไม่มี active import; upgrade: เก็บเมื่อหน้าที่ใช้งานจริง import มิฉะนั้นลบ
import { Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
