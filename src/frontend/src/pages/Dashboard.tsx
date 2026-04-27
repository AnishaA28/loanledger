import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useLoans } from "../hooks/use-loans";
import { formatCurrency, formatDate } from "../lib/format";
import type { LoanStatus } from "../types";

const STATUS_LABEL: Record<LoanStatus, string> = {
  active: "Active",
  completed: "Completed",
};

const STATUS_CLASS: Record<LoanStatus, string> = {
  active: "status-active",
  completed: "status-completed",
};

export default function Dashboard() {
  const { data: loans = [], isLoading } = useLoans();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="font-display font-bold text-2xl text-foreground"
            data-ocid="dashboard.page"
          >
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {loans.length} loan{loans.length !== 1 ? "s" : ""} tracked
          </p>
        </div>
        <Button asChild size="sm" data-ocid="dashboard.new_loan_button">
          <Link to="/loans/new">
            <Plus className="w-4 h-4 mr-1.5" />
            New Loan
          </Link>
        </Button>
      </div>

      {/* Summary cards */}
      {loans.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Total Given",
              value: formatCurrency(
                loans.reduce((s, l) => s + l.amount_given, 0),
              ),
              color: "text-foreground",
            },
            {
              label: "Total Pending",
              value: formatCurrency(
                loans.reduce((s, l) => s + l.pending_amount, 0),
              ),
              color: "text-chart-4",
            },
            {
              label: "Total Recovered",
              value: formatCurrency(
                loans.reduce((s, l) => s + l.total_returned, 0),
              ),
              color: "text-chart-3",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-lg p-4"
            >
              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
                {stat.label}
              </p>
              <p className={`font-display font-bold text-xl ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Loans grid */}
      {isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          data-ocid="dashboard.loading_state"
        >
          {["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((sk) => (
            <div
              key={sk}
              className="bg-card border border-border rounded-lg p-4 animate-pulse space-y-3"
            >
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-6 bg-muted rounded w-1/2" />
              <div className="h-3 bg-muted rounded w-full" />
            </div>
          ))}
        </div>
      ) : loans.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 text-center"
          data-ocid="dashboard.empty_state"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display font-semibold text-lg text-foreground mb-1">
            No loans yet
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            Create your first loan to start tracking repayments.
          </p>
          <Button asChild data-ocid="dashboard.empty_new_loan_button">
            <Link to="/loans/new">Create first loan</Link>
          </Button>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          data-ocid="dashboard.loan_list"
        >
          {loans.map((loan, idx) => (
            <Link
              key={loan.id.toString()}
              to="/loans/$loanId"
              params={{ loanId: loan.id.toString() }}
              className="block"
              data-ocid={`dashboard.loan_card.${idx + 1}`}
            >
              <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-smooth hover:border-primary/30 h-full flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-medium text-foreground truncate">
                    {loan.given_to}
                  </span>
                  <span
                    className={`badge-sm ${STATUS_CLASS[loan.status]} shrink-0`}
                  >
                    {STATUS_LABEL[loan.status]}
                  </span>
                </div>
                <p className="font-display font-bold text-xl text-foreground mb-3">
                  {formatCurrency(loan.amount_given)}
                </p>
                <div className="flex justify-between text-xs text-muted-foreground mb-3 gap-2">
                  <div>
                    <span className="block">Given date</span>
                    <span className="text-foreground font-medium">
                      {formatDate(loan.given_date)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block">Pending</span>
                    <span className="text-foreground font-medium">
                      {formatCurrency(loan.pending_amount)}
                    </span>
                  </div>
                </div>
                <div className="mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    asChild
                    data-ocid={`dashboard.add_repayment_button.${idx + 1}`}
                  >
                    <span>View Details</span>
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
