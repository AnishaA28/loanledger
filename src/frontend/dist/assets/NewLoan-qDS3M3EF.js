import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, B as Button } from "./index-B_u2THU7.js";
import { L as Label, I as Input, T as Textarea, u as ue } from "./index-Bjom-W3Z.js";
import { b as useCreateLoan, t as todayISO } from "./use-loans-BriHzEUf.js";
function NewLoan() {
  const navigate = useNavigate();
  const { mutateAsync: createLoan, isPending } = useCreateLoan();
  const [form, setForm] = reactExports.useState({
    given_to: "",
    amount_given: "",
    given_date: todayISO(),
    notes: ""
  });
  const [errors, setErrors] = reactExports.useState({});
  function validate() {
    const e = {};
    if (!form.given_to.trim()) e.given_to = "Borrower name is required";
    if (!form.amount_given || Number(form.amount_given) <= 0)
      e.amount_given = "Enter a valid amount";
    if (!form.given_date) e.given_date = "Given date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    try {
      const id = await createLoan({
        given_to: form.given_to.trim(),
        amount_given: Number(form.amount_given),
        given_date: form.given_date,
        notes: form.notes.trim()
      });
      ue.success("Loan created successfully");
      void navigate({
        to: "/loans/$loanId",
        params: { loanId: id.toString() }
      });
    } catch {
      ue.error("Failed to create loan. Please try again.");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "container mx-auto px-4 py-8 max-w-lg",
      "data-ocid": "new_loan.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground", children: "New Loan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: "Record a new loan disbursement" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "form",
          {
            onSubmit: handleSubmit,
            className: "bg-card border border-border rounded-lg p-6 space-y-5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "given_to", children: "Borrower Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "given_to",
                    placeholder: "e.g. Rahul Sharma",
                    value: form.given_to,
                    onChange: (e) => setForm((f) => ({ ...f, given_to: e.target.value })),
                    "data-ocid": "new_loan.given_to_input"
                  }
                ),
                errors.given_to && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-destructive text-xs",
                    "data-ocid": "new_loan.given_to_field_error",
                    children: errors.given_to
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "amount_given", children: "Loan Amount (₹)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "amount_given",
                    type: "number",
                    min: "1",
                    placeholder: "e.g. 50000",
                    value: form.amount_given,
                    onChange: (e) => setForm((f) => ({ ...f, amount_given: e.target.value })),
                    "data-ocid": "new_loan.amount_given_input"
                  }
                ),
                errors.amount_given && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-destructive text-xs",
                    "data-ocid": "new_loan.amount_given_field_error",
                    children: errors.amount_given
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "given_date", children: "Given Date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "given_date",
                    type: "date",
                    value: form.given_date,
                    onChange: (e) => setForm((f) => ({ ...f, given_date: e.target.value })),
                    "data-ocid": "new_loan.given_date_input"
                  }
                ),
                errors.given_date && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-destructive text-xs",
                    "data-ocid": "new_loan.given_date_field_error",
                    children: errors.given_date
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "notes", children: [
                  "Notes",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "(optional)" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "notes",
                    placeholder: "Any additional details about this loan…",
                    rows: 3,
                    value: form.notes,
                    onChange: (e) => setForm((f) => ({ ...f, notes: e.target.value })),
                    "data-ocid": "new_loan.notes_textarea"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    className: "flex-1",
                    onClick: () => void navigate({ to: "/dashboard" }),
                    "data-ocid": "new_loan.cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "submit",
                    className: "flex-1",
                    disabled: isPending,
                    "data-ocid": "new_loan.submit_button",
                    children: isPending ? "Creating…" : "Create Loan"
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
}
export {
  NewLoan as default
};
