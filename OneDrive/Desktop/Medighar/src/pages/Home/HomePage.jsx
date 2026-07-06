import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";
import Logo from "@/shared/components/common/Logo.jsx";
import { appName, tagline } from "@/config/branding.js";

function HomePage() {
  return (
    <Section className="flex min-h-screen items-center">
      <Container className="flex flex-col items-center gap-6">
        <Logo size="lg" showText={false} />
        <PageHeading title={appName} subtitle={tagline} />
      </Container>
    </Section>
  );
}

export default HomePage;
