import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import PageHeading from "@/shared/components/ui/PageHeading.jsx";

function HomePage() {
  return (
    <Section className="flex min-h-screen items-center">
      <Container>
        <PageHeading title="Medighar" subtitle="Healthcare made simpler." />
      </Container>
    </Section>
  );
}

export default HomePage;
