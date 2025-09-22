# Mobile Page Loading System

This project implements a responsive page loading system that automatically detects screen size and loads mobile-specific or desktop-specific pages accordingly.

## How It Works

### 1. Mobile Detection Hook (`useIsMobile`)
- Located in `client/hooks/use-mobile.tsx`
- Uses `window.matchMedia` to detect screen size
- Breakpoint: 768px (screens smaller than 768px are considered mobile)
- Returns `true` for mobile, `false` for desktop

### 2. Mobile Page Wrapper (`MobilePageWrapper`)
- Located in `client/components/MobilePageWrapper.tsx`
- Higher-order component that conditionally renders mobile or desktop components
- Shows a loading spinner while determining screen size
- Automatically switches between mobile and desktop versions

### 3. Responsive Utilities (`useResponsive`)
- Located in `client/hooks/use-responsive.tsx`
- Provides utilities for conditional rendering, classes, and styles
- Useful for components that need responsive behavior within a single component

## Implementation

### Setting Up Mobile Pages

1. **Create Mobile Version**: Create a mobile-specific version of your page
   ```tsx
   // pages/MyPageMobile.tsx
   export default function MyPageMobile() {
     return (
       <div className="mobile-optimized-layout">
         {/* Mobile-specific content */}
       </div>
     );
   }
   ```

2. **Update App.tsx**: Wrap the route with `MobilePageWrapper`
   ```tsx
   import { MobilePageWrapper } from "./components/MobilePageWrapper";
   import MyPage from "./pages/MyPage";
   import MyPageMobile from "./pages/MyPageMobile";

   <Route 
     path="/my-page" 
     element={
       <MobilePageWrapper 
         desktopComponent={MyPage} 
         mobileComponent={MyPageMobile} 
       />
     } 
   />
   ```

### Using Responsive Utilities

For components that need responsive behavior within a single component:

```tsx
import { useResponsive } from "../hooks/use-responsive";

function MyComponent() {
  const { isMobile, responsive } = useResponsive();

  return (
    <div className={responsive.classes.mobile("mobile-class", "desktop-class")}>
      {responsive.render.only.mobile(<MobileOnlyContent />)}
      {responsive.render.only.desktop(<DesktopOnlyContent />)}
    </div>
  );
}
```

## Current Mobile Pages

The following pages have mobile-specific versions:

1. **HomePage** (`/`) - `HomePageMobile.tsx`
   - Single column car grid
   - Full-width search bar
   - Optimized spacing and typography

2. **LoginPage** (`/login`) - `LoginPageMobile.tsx`
   - Smaller hero image
   - Centered form layout
   - Reduced padding and margins

3. **CarPage** (`/car/:id`) - `CarPageMobile.tsx`
   - Horizontal scrolling image gallery
   - 2-column vehicle details grid
   - Compact recent listings

4. **RegistrationPage** (`/register`) - `RegistrationPageMobile.tsx`
   - Full-width form layout
   - Optimized spacing

## Benefits

1. **Performance**: Mobile pages are optimized for smaller screens
2. **User Experience**: Better touch interactions and navigation
3. **Maintainability**: Separate concerns between mobile and desktop
4. **Flexibility**: Easy to add mobile-specific features

## Adding New Mobile Pages

1. Create the mobile version of your page
2. Import both desktop and mobile components in `App.tsx`
3. Wrap the route with `MobilePageWrapper`
4. Test on both mobile and desktop viewports

## Testing

- Use browser dev tools to test mobile viewports
- Test on actual mobile devices
- Verify that the mobile detection works correctly
- Check that the loading spinner appears briefly

## Future Enhancements

- Add tablet-specific pages (1024px breakpoint)
- Implement lazy loading for mobile pages
- Add analytics to track mobile vs desktop usage
- Create shared components for common mobile patterns 