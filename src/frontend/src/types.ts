// TypeScript types for LoanLedger — mirrors backend Candid types
// BigInt fields are mapped to number for display convenience in UI

export type LoanStatus = "active" | "completed";

export interface Loan {
  id: bigint;
  amount_given: number;
  given_by: string;
  given_to: string;
  given_date: string;
  total_returned: number;
  pending_amount: number;
  status: LoanStatus;
  notes: string;
  created_at: bigint;
}

export interface Repayment {
  id: bigint;
  loan_id: bigint;
  amount_returned: number;
  return_date: string;
  returned_by: string;
  notes: string;
}

export interface CreateLoanInput {
  given_to: string;
  amount_given: number;
  given_date: string;
  notes: string;
}

export interface AddRepaymentInput {
  loan_id: bigint;
  amount_returned: number;
  return_date: string;
  notes: string;
}
