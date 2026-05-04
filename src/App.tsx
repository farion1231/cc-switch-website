import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageProvider";
import { useLanguage } from "./i18n/useLanguage";
import { Seo } from "./components/seo/Seo";
import { SiteNavbar } from "./components/ccswitch/SiteNavbar";
import NotFound from "./pages/NotFound";

const CCSwitchHome = lazy(() => import("./pages/CCSwitchHome"));
const DocsPage = lazy(() => import("./pages/DocsPage"));
const ChangelogPage = lazy(() => import("./pages/ChangelogPage"));
const SponsorsPage = lazy(() => import("./pages/SponsorsPage"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function RouteFallback() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
      {t.common.loading}
    </div>
  );
}

const App = () => (
  <LanguageProvider>
    <TooltipProvider>
      <Seo />
      <ScrollToTop />
      <Toaster />
      <Sonner />
      <SiteNavbar />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<CCSwitchHome />} />
          <Route path="/zh" element={<CCSwitchHome />} />
          <Route path="/en" element={<CCSwitchHome />} />
          <Route path="/ja" element={<CCSwitchHome />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/zh/docs" element={<DocsPage />} />
          <Route path="/en/docs" element={<DocsPage />} />
          <Route path="/ja/docs" element={<DocsPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
          <Route path="/changelog/:version" element={<ChangelogPage />} />
          <Route path="/zh/changelog" element={<ChangelogPage />} />
          <Route path="/zh/changelog/:version" element={<ChangelogPage />} />
          <Route path="/en/changelog" element={<ChangelogPage />} />
          <Route path="/en/changelog/:version" element={<ChangelogPage />} />
          <Route path="/ja/changelog" element={<ChangelogPage />} />
          <Route path="/ja/changelog/:version" element={<ChangelogPage />} />
          <Route path="/sponsors" element={<SponsorsPage />} />
          <Route path="/zh/sponsors" element={<SponsorsPage />} />
          <Route path="/en/sponsors" element={<SponsorsPage />} />
          <Route path="/ja/sponsors" element={<SponsorsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </TooltipProvider>
  </LanguageProvider>
);

export default App;
