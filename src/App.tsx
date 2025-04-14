import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
// import BasicTables from "./pages/Tables/BasicTables";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TransactionsPage } from "./pages/Tables/TransactionsPage";

const queryClient = new QueryClient();

// Composant de route protégée qui vérifie l'authentification
const ProtectedRoute = () => {
  // Fonction pour vérifier si l'utilisateur est authentifié
  const isAuthenticated = () => {
    // Vérifiez la présence d'un token dans localStorage, sessionStorage,
    // ou d'un état d'authentification dans votre store Redux/Context
    // return localStorage.getItem('authToken') !== null;
    // ou return votre_auth_context.isLoggedIn === true;

    return true;
  };

  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
  // Sinon, rendre les composants enfants (Outlet)
  return isAuthenticated() ? <Outlet /> : <Navigate to="/signin" replace />;
};

// Composant de route non protégée qui vérifie l'authentification
const UnprotectedRoute = () => {
  // Fonction pour vérifier si l'utilisateur n'est pas authentifié
  const isNotAuthenticated = () => {
    // Vérifiez la présence d'un token dans localStorage, sessionStorage,
    // ou d'un état d'authentification dans votre store Redux/Context
    // return localStorage.getItem('authToken') !== null;
    // ou return votre_auth_context.isLoggedIn === true;

    return false;
  };

  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
  // Sinon, rendre les composants enfants (Outlet)
  return isNotAuthenticated() ? <Outlet /> : <Navigate to="/" replace />;
};

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Auth Layout */}
            <Route element={<UnprotectedRoute />}>
              <Route path="/signin" element={<SignIn />} />
            </Route>

            {/* Dashboard Layout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route index path="/" element={<Home />} />
                <Route
                  index
                  path="/transactions"
                  element={<TransactionsPage />}
                />
                <Route index path="/user-kyc2" element={<Home />} />
                <Route index path="/user-kyc3" element={<Home />} />
                <Route index path="/user-marchand" element={<Home />} />
                <Route index path="/gest-admins" element={<Home />} />

                {/* Profile Page */}
                <Route path="/profile" element={<UserProfiles />} />
              </Route>
            </Route>

            {/* <Route path="/signup" element={<SignUp />} /> */}

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </>
  );
}
