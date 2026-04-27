import { j as jsxRuntimeExports, B as Button, L as Link } from "./index-B_u2THU7.js";
import { u as useLoans, f as formatCurrency, a as formatDate } from "./use-loans-BriHzEUf.js";
import { P as Plus } from "./plus-gm1tv9m1.js";
const STATUS_LABEL = {
  active: "Active",
  completed: "Completed"
};
const STATUS_CLASS = {
  active: "status-active",
  completed: "status-completed"
};
function Dashboard() {
  const { data: loans = [], isLoading } = useLoans();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h1",
          {
            className: "font-display font-bold text-2xl text-foreground",
            "data-ocid": "dashboard.page",
            children: "Dashboard"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mt-0.5", children: [
          loans.length,
          " loan",
          loans.length !== 1 ? "s" : "",
          " tracked"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", "data-ocid": "dashboard.new_loan_button", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/loans/new", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-1.5" }),
        "New Loan"
      ] }) })
    ] }),
    loans.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8", children: [
      {
        label: "Total Given",
        value: formatCurrency(
          loans.reduce((s, l) => s + l.amount_given, 0)
        ),
        color: "text-foreground"
      },
      {
        label: "Total Pending",
        value: formatCurrency(
          loans.reduce((s, l) => s + l.pending_amount, 0)
        ),
        color: "text-chart-4"
      },
      {
        label: "Total Recovered",
        value: formatCurrency(
          loans.reduce((s, l) => s + l.total_returned, 0)
        ),
        color: "text-chart-3"
      }
    ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "bg-card border border-border rounded-lg p-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs uppercase tracking-wide mb-1", children: stat.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `font-display font-bold text-xl ${stat.color}`, children: stat.value })
        ]
      },
      stat.label
    )) }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
        "data-ocid": "dashboard.loading_state",
        children: ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((sk) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-lg p-4 animate-pulse space-y-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-muted rounded w-3/4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 bg-muted rounded w-1/2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-muted rounded w-full" })
            ]
          },
          sk
        ))
      }
    ) : loans.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 text-center",
        "data-ocid": "dashboard.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-8 h-8 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-lg text-foreground mb-1", children: "No loans yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-4", children: "Create your first loan to start tracking repayments." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, "data-ocid": "dashboard.empty_new_loan_button", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/loans/new", children: "Create first loan" }) })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
        "data-ocid": "dashboard.loan_list",
        children: loans.map((loan, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/loans/$loanId",
            params: { loanId: loan.id.toString() },
            className: "block",
            "data-ocid": `dashboard.loan_card.${idx + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg p-4 hover:shadow-md transition-smooth hover:border-primary/30 h-full flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground truncate", children: loan.given_to }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `badge-sm ${STATUS_CLASS[loan.status]} shrink-0`,
                    children: STATUS_LABEL[loan.status]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-xl text-foreground mb-3", children: formatCurrency(loan.amount_given) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mb-3 gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block", children: "Given date" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: formatDate(loan.given_date) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block", children: "Pending" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: formatCurrency(loan.pending_amount) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "w-full text-xs",
                  asChild: true,
                  "data-ocid": `dashboard.add_repayment_button.${idx + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "View Details" })
                }
              ) })
            ] })
          },
          loan.id.toString()
        ))
      }
    )
  ] });
}
export {
  Dashboard as default
};
