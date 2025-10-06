interface PriceSectionProps {
  currentPrice: string;
  discountPrice?: string;
  discount?: string;
  taxNote: string;
  originalPrice: string;
}

export default function PriceSection({
  currentPrice,
  discountPrice,
  discount,
  taxNote,
  originalPrice,
}: PriceSectionProps) {
  return (
    <div className="px-2">
      {/* Original price with strikethrough */}
      {discountPrice && (
        <div className="flex items-center gap-[10px] mb-4">
          <div className="relative">
            <span className="text-[#747474] text-[16px] font-medium">
              {discountPrice}
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

      {/* Current price and email button on same line */}
      <div className="flex items-center justify-between">
        <span className="text-[#1A202C] text-[26px] font-semibold leading-normal">
          {currentPrice}
        </span>
        <button className="bg-brand-primary text-white px-5 py-[10px] rounded-[10px] text-base font-normal leading-[150%">
          Saada e-mail
        </button>
      </div>
      
      {/* Tax note */}
      <p className="text-[#747474] text-[12px] font-normal leading-[150%] tracking-[-0.36px] mt-[5px] text-end">
        {taxNote}
      </p>
    </div>
  );
}
