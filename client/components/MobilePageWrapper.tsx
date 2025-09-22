import React from "react";
import { useIsMobile } from "../hooks/use-mobile";

interface MobilePageWrapperProps {
  desktopComponent: React.ComponentType<any>;
  mobileComponent: React.ComponentType<any>;
  props?: any;
}

export const MobilePageWrapper: React.FC<MobilePageWrapperProps> = ({
  desktopComponent: DesktopComponent,
  mobileComponent: MobileComponent,
  props = {},
}) => {
  const isMobile = useIsMobile();

  // Show loading state while determining screen size
  if (isMobile === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#06d6a0]"></div>
      </div>
    );
  }

  // Render appropriate component based on screen size
  return isMobile ? <MobileComponent {...props} /> : <DesktopComponent {...props} />;
}; 