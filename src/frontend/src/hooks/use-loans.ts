import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import { bigIntToNumber } from "../lib/format";
import type {
  AddRepaymentInput,
  CreateLoanInput,
  Loan,
  Repayment,
} from "../types";

// Helper: map backend Loan to frontend Loan (BigInt → number)
function mapLoan(raw: import("../backend").Loan): Loan {
  return {
    id: raw.id,
    amount_given: bigIntToNumber(raw.amount_given),
    given_by: raw.given_by.toText(),
    given_to: raw.given_to,
    given_date: raw.given_date,
    total_returned: bigIntToNumber(raw.total_returned),
    pending_amount: bigIntToNumber(raw.pending_amount),
    status: raw.status as Loan["status"],
    notes: raw.notes,
    created_at: raw.created_at,
  };
}

// Helper: map backend Repayment to frontend Repayment (BigInt → number)
function mapRepayment(raw: import("../backend").Repayment): Repayment {
  return {
    id: raw.id,
    loan_id: raw.loan_id,
    amount_returned: bigIntToNumber(raw.amount_returned),
    return_date: raw.return_date,
    returned_by: raw.returned_by.toText(),
    notes: raw.notes,
  };
}

export function useLoans() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Loan[]>({
    queryKey: ["loans"],
    queryFn: async () => {
      if (!actor) return [];
      const loans = await actor.getLoans();
      return loans.map(mapLoan);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLoan(id: bigint | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Loan | null>({
    queryKey: ["loan", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      const loan = await actor.getLoan(id);
      return loan ? mapLoan(loan) : null;
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useRepayments(loanId: bigint | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Repayment[]>({
    queryKey: ["repayments", loanId?.toString()],
    queryFn: async () => {
      if (!actor || loanId === null) return [];
      const repayments = await actor.getRepayments(loanId);
      return repayments.map(mapRepayment);
    },
    enabled: !!actor && !isFetching && loanId !== null,
  });
}

export function useCreateLoan() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateLoanInput) => {
      if (!actor) throw new Error("Not connected");
      const id = await actor.createLoan(
        input.given_to,
        BigInt(input.amount_given),
        input.given_date,
        input.notes,
      );
      return id;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["loans"] });
    },
  });
}

export function useAddRepayment() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: AddRepaymentInput) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.addRepayment(
        input.loan_id,
        BigInt(input.amount_returned),
        input.return_date,
        input.notes,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["loans"] });
      void queryClient.invalidateQueries({
        queryKey: ["loan", variables.loan_id.toString()],
      });
      void queryClient.invalidateQueries({
        queryKey: ["repayments", variables.loan_id.toString()],
      });
    },
  });
}

export function useDeleteLoan() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.deleteLoan(id);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["loans"] });
    },
  });
}
