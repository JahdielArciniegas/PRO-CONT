import { ClerkProvider } from "@clerk/clerk-react";

const ClerkLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider
      publishableKey={import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      {children}
    </ClerkProvider>
  );
};

export default ClerkLayout;
