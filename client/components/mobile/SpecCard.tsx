import { ReactNode } from "react";

interface SpecCardProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export default function SpecCard({ icon, label, value }: SpecCardProps) {
  return (
    <div className="flex items-start gap-[10px]">
      <div className="w-[30px] h-[30px] flex-shrink-0">{icon}</div>
      <div className="flex flex-col">
        <span className="text-[#1A202C] text-[14px] font-normal leading-[150%] tracking-[-0.42px]">
          {label}
        </span>
        <span className="text-[#1A202C] text-[16px] font-medium leading-[150%] tracking-[-0.48px]">
          {value}
        </span>
      </div>
    </div>
  );
}
