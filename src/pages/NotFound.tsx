import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { getLocalizedPath } from "@/i18n/routes";
import { useLanguage } from "@/i18n/useLanguage";

const NotFound = () => {
  const location = useLocation();
  const { language, t } = useLanguage();

  useEffect(() => {
    if (import.meta.env.DEV) console.error("404 Error:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-foreground">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">{t.common.notFound.title}</p>
        <Link to={getLocalizedPath('/', language)} className="text-primary hover:underline">
          {t.common.notFound.backHome}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
