import List "mo:core/List";
import Types "./types/loan";

module {
  // Old type definitions (inlined from .old/src/backend/types/loan.mo)
  type OldLoanStatus = { #active; #completed; #overdue };
  type OldLoan = {
    id : Nat;
    amount_given : Nat;
    given_by : Principal;
    given_to : Text;
    given_date : Text;
    total_returned : Nat;
    pending_amount : Nat;
    due_date : Text;
    status : OldLoanStatus;
    notes : Text;
    created_at : Int;
  };

  type OldRepayment = {
    id : Nat;
    loan_id : Nat;
    amount_returned : Nat;
    return_date : Text;
    returned_by : Principal;
    notes : Text;
  };

  type OldActor = {
    loans : List.List<OldLoan>;
    repayments : List.List<OldRepayment>;
    loanCounter : { var val : Nat };
    repaymentCounter : { var val : Nat };
  };

  type NewActor = {
    loans : List.List<Types.Loan>;
    repayments : List.List<Types.Repayment>;
    loanCounter : { var val : Nat };
    repaymentCounter : { var val : Nat };
  };

  func migrateStatus(old : OldLoanStatus) : Types.LoanStatus {
    switch (old) {
      case (#completed) #completed;
      case (#active or #overdue) #active;
    }
  };

  func migrateLoan(old : OldLoan) : Types.Loan {
    {
      id = old.id;
      amount_given = old.amount_given;
      given_by = old.given_by;
      given_to = old.given_to;
      given_date = old.given_date;
      total_returned = old.total_returned;
      pending_amount = old.pending_amount;
      status = migrateStatus(old.status);
      notes = old.notes;
      created_at = old.created_at;
    }
  };

  public func run(old : OldActor) : NewActor {
    let loans = old.loans.map<OldLoan, Types.Loan>(func(l) { migrateLoan(l) });
    // Repayments are unchanged in shape
    let repayments = old.repayments.map<OldRepayment, Types.Repayment>(
      func(r) {
        {
          id = r.id;
          loan_id = r.loan_id;
          amount_returned = r.amount_returned;
          return_date = r.return_date;
          returned_by = r.returned_by;
          notes = r.notes;
        }
      }
    );
    {
      loans;
      repayments;
      loanCounter = old.loanCounter;
      repaymentCounter = old.repaymentCounter;
    }
  };
};
