import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageProvider";
import { useLanguage } from "./i18n/useLanguage";
import { Seo } from "./components/seo/Seo";
import NotFound from "./pages/NotFound";

const CCSwitchHome = lazy(() => import("./pages/CCSwitchHome"));
const DocsPage = lazy(() => import("./pages/DocsPage"));
const ChangelogPage = lazy(() => import("./pages/ChangelogPage"));

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
      <Toaster />
      <Sonner />
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
          <Route path="/zh/changelog" element={<ChangelogPage />} />
          <Route path="/en/changelog" element={<ChangelogPage />} />
          <Route path="/ja/changelog" element={<ChangelogPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </TooltipProvider>
  </LanguageProvider>
);

export default App;
