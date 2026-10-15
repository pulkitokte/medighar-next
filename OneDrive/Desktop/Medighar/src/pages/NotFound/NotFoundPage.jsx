import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Section from "@/shared/components/ui/Section.jsx";
import Container from "@/shared/components/ui/Container.jsx";
import EmptyState from "@/shared/components/ui/EmptyState.jsx";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Section paddingY="py-16 sm:py-20">
      <Container>
        <EmptyState
          icon={Search}
          title="Page not found."
          description="The page you're looking for doesn't exist or may have moved."
          action={() => navigate("/")}
          actionLabel="Go to Home"
        />
      </Container>
    </Section>
  );
}

export default NotFoundPage;
