import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Layout } from "./components/Layout";
import { useAuth } from "./hooks/use-auth";

import { Skeleton } from "@/components/ui/skeleton";
// ── Lazy page imports ─────────────────────────────────────────────────────────
import { Suspense, lazy } from "react";

const DashboardPage = lazy(() => import("./pages/Dashboard"));
const NewLoanPage = lazy(() => import("./pages/NewLoan"));
const LoanDetailPage = lazy(() => import("./pages/LoanDetail"));

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-8 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 w-full" />
          </div>
        }
      >
        {children}
      </Suspense>
    </Layout>
  );
}

// ── Auth guard wrapper ────────────────────────────────────────────────────────
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing, login, isLoggingIn } = useAuth();

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <Skeleton className="h-8 w-32 mx-auto" />
          <p className="text-muted-foreground text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div
          className="text-center space-y-4 max-w-sm"
          data-ocid="auth.unauthenticated_state"
        >
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-7 h-7 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div>
            <h2 className="font-display font-semibold text-xl text-foreground">
              Sign in required
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Please sign in with Internet Identity to access your loans.
            </p>
          </div>
          <button
            type="button"
            onClick={login}
            disabled={isLoggingIn}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
            data-ocid="auth.login_button"
          >
            {isLoggingIn ? "Signing in…" : "Sign in with Internet Identity"}
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// ── Routes ────────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <PageShell>
      <AuthGuard>
        <DashboardPage />
      </AuthGuard>
    </PageShell>
  ),
});

const newLoanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/loans/new",
  component: () => (
    <PageShell>
      <AuthGuard>
        <NewLoanPage />
      </AuthGuard>
    </PageShell>
  ),
});

const loanDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/loans/$loanId",
  component: () => (
    <PageShell>
      <AuthGuard>
        <LoanDetailPage />
      </AuthGuard>
    </PageShell>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  newLoanRoute,
  loanDetailRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
