import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Link, useParams } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddRepayment,
  useDeleteLoan,
  useLoan,
  useRepayments,
} from "../hooks/use-loans";
import { formatCurrency, formatDate, todayISO } from "../lib/format";
import type { LoanStatus } from "../types";

const STATUS_CLASS: Record<LoanStatus, string> = {
  active: "status-active",
  completed: "status-completed",
};

export default function LoanDetail() {
  const { loanId } = useParams({ from: "/loans/$loanId" });
  const navigate = useNavigate();
  const id = BigInt(loanId);
  const { data: loan, isLoading } = useLoan(id);
  const { data: repayments = [] } = useRepayments(id);
  const { mutateAsync: addRepayment, isPending: isAddingRepayment } =
    useAddRepayment();
  const { mutateAsync: deleteLoan, isPending: isDeleting } = useDeleteLoan();

  const [repayForm, setRepayForm] = useState({
    amount_returned: "",
    return_date: todayISO(),
    notes: "",
  });
  const [repayError, setRepayError] = useState("");

  async function handleRepaySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!loan) return;
    const amount = Number(repayForm.amount_returned);
    if (!amount || amount <= 0) {
      setRepayError("Enter a valid amount");
      return;
    }
    if (amount > loan.pending_amount) {
      setRepayError(
        `Amount cannot exceed pending ₹${loan.pending_amount.toLocaleString("en-IN")}`,
      );
      return;
    }
    setRepayError("");
    try {
      await addRepayment({
        loan_id: id,
        amount_returned: amount,
        return_date: repayForm.return_date,
        notes: repayForm.notes,
      });
      toast.success("Repayment recorded");
      setRepayForm({ amount_returned: "", return_date: todayISO(), notes: "" });
    } catch {
      toast.error("Failed to record repayment");
    }
  }

  async function handleDelete() {
    try {
      await deleteLoan(id);
      toast.success("Loan deleted");
      void navigate({ to: "/dashboard" });
    } catch {
      toast.error("Failed to delete loan");
    }
  }

  if (isLoading) {
    return (
      <div
        className="container mx-auto px-4 py-8 max-w-2xl space-y-4"
        data-ocid="loan_detail.loading_state"
      >
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!loan) {
    return (
      <div
        className="container mx-auto px-4 py-8 text-center"
        data-ocid="loan_detail.error_state"
      >
        <p className="text-muted-foreground">Loan not found.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div
      className="container mx-auto px-4 py-8 max-w-2xl"
      data-ocid="loan_detail.page"
    >
      {/* Back link */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5"
        data-ocid="loan_detail.back_link"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Loan summary card */}
      <div className="bg-card border border-border rounded-lg p-5 mb-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">
              {loan.given_to}
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Loan to {loan.given_to}
            </p>
          </div>
          <span className={`badge-sm ${STATUS_CLASS[loan.status]}`}>
            {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          {[
            { label: "Amount Given", value: formatCurrency(loan.amount_given) },
            { label: "Pending", value: formatCurrency(loan.pending_amount) },
            { label: "Recovered", value: formatCurrency(loan.total_returned) },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-muted-foreground text-xs mb-0.5">
                {item.label}
              </p>
              <p className="font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>

        {loan.notes && (
          <p className="mt-4 text-sm text-muted-foreground border-t border-border pt-3">
            {loan.notes}
          </p>
        )}

        {/* Delete */}
        <div className="mt-4 flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive gap-1.5"
                data-ocid="loan_detail.delete_button"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Loan
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent data-ocid="loan_detail.delete_dialog">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this loan?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the loan to{" "}
                  <strong>{loan.given_to}</strong> and all its repayment
                  history. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel data-ocid="loan_detail.delete_cancel_button">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  data-ocid="loan_detail.delete_confirm_button"
                >
                  {isDeleting ? "Deleting…" : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Add repayment form */}
      {loan.status !== "completed" && (
        <div className="bg-card border border-border rounded-lg p-5 mb-5">
          <h2 className="font-display font-semibold text-base text-foreground mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            Record Repayment
          </h2>
          <form
            onSubmit={handleRepaySubmit}
            className="space-y-4"
            data-ocid="loan_detail.repayment_form"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="repay_amount">Amount (₹)</Label>
                <Input
                  id="repay_amount"
                  type="number"
                  min="1"
                  max={loan.pending_amount}
                  placeholder="e.g. 5000"
                  value={repayForm.amount_returned}
                  onChange={(e) =>
                    setRepayForm((f) => ({
                      ...f,
                      amount_returned: e.target.value,
                    }))
                  }
                  data-ocid="loan_detail.repayment_amount_input"
                />
                {repayError && (
                  <p
                    className="text-destructive text-xs"
                    data-ocid="loan_detail.repayment_amount_field_error"
                  >
                    {repayError}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="repay_date">Return Date</Label>
                <Input
                  id="repay_date"
                  type="date"
                  value={repayForm.return_date}
                  onChange={(e) =>
                    setRepayForm((f) => ({ ...f, return_date: e.target.value }))
                  }
                  data-ocid="loan_detail.repayment_date_input"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="repay_notes">
                Notes{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Textarea
                id="repay_notes"
                placeholder="Payment method, reference number…"
                rows={2}
                value={repayForm.notes}
                onChange={(e) =>
                  setRepayForm((f) => ({ ...f, notes: e.target.value }))
                }
                data-ocid="loan_detail.repayment_notes_textarea"
              />
            </div>
            <Button
              type="submit"
              disabled={isAddingRepayment}
              className="w-full"
              data-ocid="loan_detail.repayment_submit_button"
            >
              {isAddingRepayment ? "Recording…" : "Record Repayment"}
            </Button>
          </form>
        </div>
      )}

      {/* Repayment history */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h2 className="font-display font-semibold text-base text-foreground mb-4">
          Repayment History
        </h2>
        {repayments.length === 0 ? (
          <p
            className="text-muted-foreground text-sm text-center py-6"
            data-ocid="loan_detail.repayments_empty_state"
          >
            No repayments recorded yet.
          </p>
        ) : (
          <div className="space-y-2" data-ocid="loan_detail.repayments_list">
            {repayments.map((rep, idx) => (
              <div
                key={rep.id.toString()}
                className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
                data-ocid={`loan_detail.repayment_item.${idx + 1}`}
              >
                <div>
                  <p className="font-medium text-sm text-foreground">
                    {formatCurrency(rep.amount_returned)}
                  </p>
                  {rep.notes && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {rep.notes}
                    </p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDate(rep.return_date)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
