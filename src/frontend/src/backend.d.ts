import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export type Result = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export type RepaymentId = bigint;
export interface Loan {
    id: LoanId;
    status: LoanStatus;
    pending_amount: bigint;
    total_returned: bigint;
    created_at: Timestamp;
    amount_given: bigint;
    given_date: string;
    notes: string;
    given_by: Principal;
    given_to: string;
}
export interface Repayment {
    id: RepaymentId;
    loan_id: LoanId;
    amount_returned: bigint;
    return_date: string;
    notes: string;
    returned_by: Principal;
}
export type LoanId = bigint;
export type Result_1 = {
    __kind__: "ok";
    ok: RepaymentId;
} | {
    __kind__: "err";
    err: string;
};
export enum LoanStatus {
    active = "active",
    completed = "completed"
}
export interface backendInterface {
    addRepayment(loan_id: LoanId, amount_returned: bigint, return_date: string, notes: string): Promise<Result_1>;
    createLoan(given_to: string, amount_given: bigint, given_date: string, notes: string): Promise<LoanId>;
    deleteLoan(id: LoanId): Promise<Result>;
    getLoan(id: LoanId): Promise<Loan | null>;
    getLoans(): Promise<Array<Loan>>;
    getRepayments(loan_id: LoanId): Promise<Array<Repayment>>;
}
