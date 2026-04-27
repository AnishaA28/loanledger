import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateLoan } from "../hooks/use-loans";
import { todayISO } from "../lib/format";

export default function NewLoan() {
  const navigate = useNavigate();
  const { mutateAsync: createLoan, isPending } = useCreateLoan();

  const [form, setForm] = useState({
    given_to: "",
    amount_given: "",
    given_date: todayISO(),
    notes: "",
  });

  const [errors, setErrors] = useState<Partial<typeof form>>({});

  function validate(): boolean {
    const e: Partial<typeof form> = {};
    if (!form.given_to.trim()) e.given_to = "Borrower name is required";
    if (!form.amount_given || Number(form.amount_given) <= 0)
      e.amount_given = "Enter a valid amount";
    if (!form.given_date) e.given_date = "Given date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    try {
      const id = await createLoan({
        given_to: form.given_to.trim(),
        amount_given: Number(form.amount_given),
        given_date: form.given_date,
        notes: form.notes.trim(),
      });
      toast.success("Loan created successfully");
      void navigate({
        to: "/loans/$loanId",
        params: { loanId: id.toString() },
      });
    } catch {
      toast.error("Failed to create loan. Please try again.");
    }
  }

  return (
    <div
      className="container mx-auto px-4 py-8 max-w-lg"
      data-ocid="new_loan.page"
    >
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-foreground">
          New Loan
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Record a new loan disbursement
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-card border border-border rounded-lg p-6 space-y-5"
      >
        <div className="space-y-1.5">
          <Label htmlFor="given_to">Borrower Name</Label>
          <Input
            id="given_to"
            placeholder="e.g. Rahul Sharma"
            value={form.given_to}
            onChange={(e) =>
              setForm((f) => ({ ...f, given_to: e.target.value }))
            }
            data-ocid="new_loan.given_to_input"
          />
          {errors.given_to && (
            <p
              className="text-destructive text-xs"
              data-ocid="new_loan.given_to_field_error"
            >
              {errors.given_to}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="amount_given">Loan Amount (₹)</Label>
          <Input
            id="amount_given"
            type="number"
            min="1"
            placeholder="e.g. 50000"
            value={form.amount_given}
            onChange={(e) =>
              setForm((f) => ({ ...f, amount_given: e.target.value }))
            }
            data-ocid="new_loan.amount_given_input"
          />
          {errors.amount_given && (
            <p
              className="text-destructive text-xs"
              data-ocid="new_loan.amount_given_field_error"
            >
              {errors.amount_given}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="given_date">Given Date</Label>
          <Input
            id="given_date"
            type="date"
            value={form.given_date}
            onChange={(e) =>
              setForm((f) => ({ ...f, given_date: e.target.value }))
            }
            data-ocid="new_loan.given_date_input"
          />
          {errors.given_date && (
            <p
              className="text-destructive text-xs"
              data-ocid="new_loan.given_date_field_error"
            >
              {errors.given_date}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="notes">
            Notes{" "}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </Label>
          <Textarea
            id="notes"
            placeholder="Any additional details about this loan…"
            rows={3}
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            data-ocid="new_loan.notes_textarea"
          />
        </div>

        <div className="flex gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => void navigate({ to: "/dashboard" })}
            data-ocid="new_loan.cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={isPending}
            data-ocid="new_loan.submit_button"
          >
            {isPending ? "Creating…" : "Create Loan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
