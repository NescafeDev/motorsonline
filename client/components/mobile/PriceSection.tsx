interface PriceSectionProps {
  currentPrice: string;
  originalPrice?: string;
  discount?: string;
  taxNote: string;
}

export default function PriceSection({
  currentPrice,
  originalPrice,
  discount,
  taxNote,
}: PriceSectionProps) {
  return (
    <div className="px-5 flex items-end justify-between">
      <div className="flex flex-col">
        {/* Original price with strikethrough */}
        {originalPrice && (
          <div className="flex items-center gap-[10px]">
            <div className="relative">
              <span className="text-[#747474] text-[16px] font-medium">
                {originalPrice}
              </span>
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#747474]"></div>
            </div>
            {discount && (
              <div className="bg-[#FFE5E5] border border-[#F00] rounded-full px-[10px] py-[3px]">
                <span className="text-[#F00] text-[14px] font-medium">{discount}</span>
              </div>
            )}
          </div>
        )}

        {/* Current price */}
        <span className="text-[#1A202C] text-[26px] font-semibold leading-normal mt-[16px]">
          {currentPrice}
        </span>

        {/* Tax note */}
        <span className="text-[#747474] text-[12px] font-normal leading-[150%] tracking-[-0.36px] mt-[3px]">
          {taxNote}
        </span>
      </div>

      {/* Email button */}
      <button className="bg-brand-primary text-white px-5 py-[10px] rounded-[10px] text-base font-normal leading-[150%]">
        Saada e-mail
      </button>
    </div>
  );
}
