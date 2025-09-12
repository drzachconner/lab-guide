import { BiohackLandingPage } from "@/components/BiohackLandingPage";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is logged in, redirect to dashboard instead of showing landing page
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Only show landing page if user is not authenticated
  return <BiohackLandingPage />;
};

export default Index;
