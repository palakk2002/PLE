import { lazy } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider as ClientThemeProvider } from "../modules/Client/context/ThemeContext";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

import ClientMainLayout from "../modules/Client/components/layout/MainLayout";
import ClientLandingPageLayout from "../modules/Client/components/layout/LandingPageLayout";

// Lazy Loaded Pages
const ClientHome = lazy(() => import("../modules/Client/pages/Home"));
const ClientAbout = lazy(() => import("../modules/Client/pages/About"));
const ClientServices = lazy(() => import("../modules/Client/pages/Services"));
const ClientPortfolio = lazy(() => import("../modules/Client/pages/Portfolio"));
const ClientGetQuote = lazy(() => import("../modules/Client/pages/GetQuote"));
const ClientServiceDetails = lazy(() => import("../modules/Client/pages/ServiceDetails"));
const ClientNotFound = lazy(() => import("../modules/Client/pages/NotFound"));
const ClientLandingPage = lazy(() => import("../modules/Client/pages/LandingPage"));
const ClientPrivacyPolicy = lazy(() => import("../modules/Client/pages/PrivacyPolicy"));
const ClientTermsConditions = lazy(() => import("../modules/Client/pages/TermsConditions"));
const ClientRefundPolicy = lazy(() => import("../modules/Client/pages/RefundPolicy"));
const ClientCookiePolicy = lazy(() => import("../modules/Client/pages/CookiePolicy"));
const ClientDPA = lazy(() => import("../modules/Client/pages/DPA"));
const ClientFAQ = lazy(() => import("../modules/Client/pages/FAQ"));

const ClientLayoutWrapper = () => {
  return (
    <ClientThemeProvider>
      <ReactLenis root options={{ autoRaf: true, duration: 0.9, lerp: 0.1 }}>
        <div className="client-app-root">
          <ClientMainLayout />
        </div>
      </ReactLenis>
    </ClientThemeProvider>
  );
};

const ClientLandingPageLayoutWrapper = () => {
  return (
    <ClientThemeProvider>
      <ReactLenis root options={{ autoRaf: true, duration: 0.9, lerp: 0.1 }}>
        <div className="client-app-root">
          <ClientLandingPageLayout />
        </div>
      </ReactLenis>
    </ClientThemeProvider>
  );
};

export default function LandingRoutes() {
  return (
    <Routes>
      {/* Client Marketing Site Routes */}
      <Route element={<ClientLayoutWrapper />}>
        <Route path="/" element={<ClientHome />} />
        <Route path="/about" element={<ClientAbout />} />
        <Route path="/services" element={<ClientServices />} />
        <Route path="/portfolio" element={<ClientPortfolio />} />
        <Route path="/get-quote" element={<ClientGetQuote />} />
        <Route path="/service/:slug" element={<ClientServiceDetails />} />
        <Route path="/services/:slug" element={<ClientServiceDetails />} />
        <Route path="/client/privacy-policy" element={<ClientPrivacyPolicy />} />
        <Route path="/client/terms-and-conditions" element={<ClientTermsConditions />} />
        <Route path="/refund-and-billing-policy" element={<ClientRefundPolicy />} />
        <Route path="/cookie-policy" element={<ClientCookiePolicy />} />
        <Route path="/data-processing-agreement" element={<ClientDPA />} />
        <Route path="/faq" element={<ClientFAQ />} />
      </Route>

      <Route element={<ClientLandingPageLayoutWrapper />}>
        <Route path="/lp/:slug" element={<ClientLandingPage />} />
      </Route>

      {/* Unknown routes show landing 404 */}
      <Route path="*" element={<ClientNotFound />} />
    </Routes>
  );
}
