import { SiteFooter } from '@/components/ccswitch/SiteFooter';
import { DownloadSection } from '@/components/download/DownloadSection';

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20 md:pt-24">
        <DownloadSection />
      </main>
      <SiteFooter />
    </div>
  );
}
