import { Suspense, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import toast, { Toaster, useToasterStore } from "react-hot-toast";

import CartDrawer from "./shared/components/Cart/CartDrawer";
import ErrorBoundary from "./shared/components/ErrorBoundary/ErrorBoundary";
import ScrollToTop from "./shared/components/ScrollToTop";
import AppBootstrap from "./shared/components/AppBootstrap";
import OfflineDetector from "./shared/components/OfflineDetector";
import AppSuspenseLoader from "./shared/components/AppSuspenseLoader";

import { isLandingDomain } from "./shared/utils/domain";
import LandingRoutes from "./routes/LandingRoutes";
import PortalRoutes from "./routes/PortalRoutes";

// Helper component to limit active toast notifications to exactly 1
const ToastLimitHandler = () => {
  const { toasts } = useToasterStore();

  useEffect(() => {
    // Only allow 1 visible toast at a time
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= 1)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts]);

  return null;
};

const ActiveRoutes = () => {
  if (isLandingDomain()) {
    return <LandingRoutes />;
  }
  return <PortalRoutes />;
};

function App() {
  return (
    <ErrorBoundary>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}>
        <OfflineDetector>
          <AppBootstrap />
          <ScrollToTop />
          <Suspense fallback={<AppSuspenseLoader />}>
            <ActiveRoutes />
          </Suspense>
          <CartDrawer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#212121",
                color: "#fff",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#388E3C",
                  secondary: "#fff",
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: "#FF6161",
                  secondary: "#fff",
                },
              },
            }}
          />
          <ToastLimitHandler />
        </OfflineDetector>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
