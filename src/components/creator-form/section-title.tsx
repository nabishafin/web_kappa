import { cn } from "@/lib/utils";

export function SectionTitle({ id, children, className }: { id: string; children: string; className?: string }) {
  return (
    <h2
      id={id}
      className={cn("border-b border-[#46285e] pt-[2px] pb-[8.5px] text-[22px] leading-7 font-bold text-[#c77dff] md:text-2xl", className)}
    >
      {children}
    </h2>
  );
}
