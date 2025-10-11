import "./global.css";

import { GoogleOAuthProvider } from "@react-oauth/google";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams, Navigate } from "react-router-dom";
import { MobilePageWrapper } from "./components/MobilePageWrapper";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageWrapper } from "./components/LanguageWrapper";
import { I18nProvider } from "./contexts/I18nContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Desktop Pages
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage";
import CarPage from "./pages/CarPage/CarPage";
import BlogPage from "./pages/BlogPage";
import PasswordResetPage from "./pages/PasswordResetPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UserPage from "./pages/UserPage";
import AddsPage from "./pages/AddsPage";
import AdminLoginPage from "./pages/admin/index";
import AdminBlogPanel from "./pages/admin/blog";
import AdminAddsPage from "./pages/admin/adds";

// Mobile Pages
import HomePageMobile from "./pages/HomePageMobile";
import CarPageMobile from "./pages/CarPage/CarPageMobile";
import LoginPageMobile from "./pages/LoginPageMobile";
import RegistrationPageMobile from "./pages/RegistrationPage/RegistrationPageMobile";
import BlogPageMobile from "./pages/BlogPageMobile";
import ForgotPasswordPageMobile from "./pages/ForgotPasswordPageMobile";
import UserPageMobile from "./pages/UserPageMobile";
import AddsPageMobile from "./pages/AddsPageMobile";
import BlogPostPage from "./pages/BlogPostPage";
import BlogPostPageMobile from "./pages/BlogPostPageMobile";
import SearchPage from "./pages/SearchPage";
import SearchPageMobile from "./pages/SearchPageMobile";
import { FavoritesTest } from "./components/FavoritesTest";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <div style={{ margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", backgroundColor:"#F6F7F9"}}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <BrowserRouter>
          <Routes>
            {/* Redirect root to default language */}
            <Route path="/" element={<Navigate to="/en" />} />
            
            {/* Admin Panel Routes - Outside language wrapper */}
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/admin/blog" element={<AdminBlogPanel />} />
            <Route path="/admin/adds" element={<AdminAddsPage />} />
            
            {/* Language-based routes */}
            <Route path="/:lang/*" element={
              <I18nProvider>
                <LanguageWrapper>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <MobilePageWrapper
                        desktopComponent={HomePage}
                        mobileComponent={HomePageMobile}
                      />
                    }
                  />
                  <Route
                    path="login"
                    element={
                      <MobilePageWrapper
                        desktopComponent={LoginPage}
                        mobileComponent={LoginPageMobile}
                      />
                    }
                  />
                  <Route
                    path="register"
                    element={
                      <MobilePageWrapper
                        desktopComponent={RegistrationPage}
                        mobileComponent={RegistrationPageMobile}
                      />
                    }
                  />
                  <Route
                    path="car/:id"
                    element={
                      <MobilePageWrapper
                        desktopComponent={CarPage}
                        mobileComponent={CarPageMobile}
                      />
                    }
                  />
                  <Route
                    path="blog"
                    element={
                      <MobilePageWrapper
                        desktopComponent={BlogPage}
                        mobileComponent={BlogPageMobile}
                      />
                    }
                  />
                  <Route
                    path="blog/:id"
                    element={
                      <MobilePageWrapper
                        desktopComponent={BlogPostPage}
                        mobileComponent={BlogPostPageMobile}
                      />
                    }
                  />
                  <Route path="password-reset" element={<PasswordResetPage />} />
                  <Route
                    path="forgot-password"
                    element={
                      <MobilePageWrapper
                        desktopComponent={ForgotPasswordPage}
                        mobileComponent={ForgotPasswordPageMobile}
                      />
                    }
                  />
                  <Route path="user" element={
                      <MobilePageWrapper
                        desktopComponent={UserPage}
                        mobileComponent={UserPageMobile}
                      />
                    }
                  />
                  <Route path="adds" element={
                      <MobilePageWrapper
                        desktopComponent={AddsPage}
                        mobileComponent={AddsPageMobile}
                      />
                    }
                  />
                  <Route path="update/:id" element={
                      <MobilePageWrapper
                        desktopComponent={AddsPage}
                        mobileComponent={AddsPageMobile}
                      />
                    }
                  />
                  <Route path="search" element={
                      <MobilePageWrapper
                        desktopComponent={SearchPage}
                        mobileComponent={SearchPageMobile}
                      />
                    }
                  />
                  <Route path="favorites-test" element={<FavoritesTest />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </LanguageWrapper>
              </I18nProvider>
            } />
            
            {/* Fallback for invalid routes */}
            <Route path="*" element={<Navigate to="/ee" replace />} />
          </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  </ErrorBoundary>
);

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="604481839237-v5sgfq8jli9es2t6r9o82enqnpmdfa2q.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
