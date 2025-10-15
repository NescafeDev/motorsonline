import { ChevronDown } from "lucide-react";
import { ReactNode } from "react";

interface ExpandableSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function ExpandableSection({
  title,
  children,
  className = "",
}: ExpandableSectionProps) {
  return (
    <div className={`bg-[#F6F7F9] rounded-[10px] p-5 ${className}`}>
      <h2 className="text-[#1A202C] text-lg font-semibold leading-[150%] tracking-[-0.54px] mb-5">
        {title}
      </h2>
      {children}
      {/* <button className="w-full flex items-center justify-center gap-[10px] border bg-transparent rounded-[10px] px-5 py-3 mt-5 border-[#06d6a0] text-[#06d6a0]">
        <span className="text-center text-base font-normal leading-[150%]">
          Näita rohkem
        </span>
        <ChevronDown className="w-4 h-4 text-primary" />
      </button> */}
    </div>
  );
}
