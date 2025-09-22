import { useIsMobile } from "./use-mobile";

export function useResponsive() {
  const isMobile = useIsMobile();

  return {
    isMobile,
    isDesktop: !isMobile,
    // Responsive breakpoints
    breakpoints: {
      mobile: 768,
      tablet: 1024,
      desktop: 1280,
    },
    // Responsive utilities
    responsive: {
      // Conditional rendering
      render: {
        mobile: (mobileComponent: any, desktopComponent: any) => 
          isMobile ? mobileComponent : desktopComponent,
        only: {
          mobile: (component: any) => isMobile ? component : null,
          desktop: (component: any) => !isMobile ? component : null,
        }
      },
      // Conditional classes
      classes: {
        mobile: (mobileClasses: string, desktopClasses: string) =>
          isMobile ? mobileClasses : desktopClasses,
        only: {
          mobile: (classes: string) => isMobile ? classes : "",
          desktop: (classes: string) => !isMobile ? classes : "",
        }
      },
      // Conditional styles
      styles: {
        mobile: (mobileStyles: React.CSSProperties, desktopStyles: React.CSSProperties) =>
          isMobile ? mobileStyles : desktopStyles,
        only: {
          mobile: (styles: React.CSSProperties) => isMobile ? styles : {},
          desktop: (styles: React.CSSProperties) => !isMobile ? styles : {},
        }
      }
    }
  };
} 