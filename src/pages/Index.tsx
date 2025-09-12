import { BiohackLandingPage } from "@/components/BiohackLandingPage";

const Index = () => {
  // Always show landing page - don't redirect logged-in users
  return <BiohackLandingPage />;
};

export default Index;
