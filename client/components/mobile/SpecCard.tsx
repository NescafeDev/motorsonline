import { ReactNode } from "react";

interface SpecCardProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export default function SpecCard({ icon, label, value }: SpecCardProps) {
  return (
    <div className="flex items-center gap-[10px]">
      <div className="w-[30px] h-[40px] flex-shrink-0 flex items-center justify-center">{icon}</div>
      <div className="flex flex-col">
        {/* <span className="text-[#1A202C] text-[14px] font-normal leading-[150%] tracking-[-0.42px] break-all"> */}
          {/* {label} */}
        {/* </span> */}
        <span className="text-[#1A202C] text-[12px] font-medium leading-[150%] tracking-[-0.48px]">
          {value}
        </span>
      </div>
    </div>
  );
}
