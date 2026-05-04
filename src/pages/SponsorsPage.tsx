import { SiteNavbar } from '@/components/ccswitch/SiteNavbar';
import { SiteFooter } from '@/components/ccswitch/SiteFooter';
import { SponsorsHero } from '@/components/sponsors/SponsorsHero';
import { SponsorTierSection } from '@/components/sponsors/SponsorTierSection';
import { SponsorPerksTable } from '@/components/sponsors/SponsorPerksTable';
import { SponsorFAQ } from '@/components/sponsors/SponsorFAQ';
import { SponsorBenefits } from '@/components/sponsors/SponsorBenefits';

export default function SponsorsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      <main className="pt-20 md:pt-24">
        <SponsorsHero />
        <SponsorTierSection tier="flagship" />
        <SponsorTierSection tier="standard" />
        <SponsorPerksTable />
        <SponsorFAQ />
        <SponsorBenefits />
      </main>
      <SiteFooter />
    </div>
  );
}
