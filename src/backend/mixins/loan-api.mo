import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import LoanLib "../lib/loan";
import Types "../types/loan";
import CommonTypes "../types/common";

mixin (
  loans : List.List<Types.Loan>,
  repayments : List.List<Types.Repayment>,
  loanCounter : { var val : Nat },
  repaymentCounter : { var val : Nat },
) {

  public shared ({ caller }) func createLoan(
    given_to : Text,
    amount_given : Nat,
    given_date : Text,
    notes : Text,
  ) : async CommonTypes.LoanId {
    let id = loanCounter.val;
    let now = Time.now();
    ignore LoanLib.createLoan(loans, id, caller, given_to, amount_given, given_date, notes, now);
    loanCounter.val += 1;
    id
  };

  public shared query ({ caller }) func getLoans() : async [Types.Loan] {
    LoanLib.getLoansForCaller(loans, caller)
  };

  public shared query ({ caller }) func getLoan(id : CommonTypes.LoanId) : async ?Types.Loan {
    switch (LoanLib.getLoanById(loans, id)) {
      case null { null };
      case (?loan) {
        if (Principal.equal(loan.given_by, caller)) ?loan else null
      };
    }
  };

  public shared ({ caller }) func addRepayment(
    loan_id : CommonTypes.LoanId,
    amount_returned : Nat,
    return_date : Text,
    notes : Text,
  ) : async Types.Result<CommonTypes.RepaymentId, Text> {
    // Verify loan exists and belongs to caller
    switch (LoanLib.getLoanById(loans, loan_id)) {
      case null { #err("Loan not found") };
      case (?loan) {
        if (not Principal.equal(loan.given_by, caller)) {
          return #err("Not authorized")
        };
        switch (LoanLib.applyRepayment(loans, loan_id, amount_returned)) {
          case (#err(e)) { #err(e) };
          case (#ok(_)) {
            let rid = repaymentCounter.val;
            ignore LoanLib.createRepayment(repayments, rid, loan_id, amount_returned, return_date, caller, notes);
            repaymentCounter.val += 1;
            #ok(rid)
          };
        }
      };
    }
  };

  public shared query ({ caller }) func getRepayments(loan_id : CommonTypes.LoanId) : async [Types.Repayment] {
    // Verify loan ownership before returning repayments
    switch (LoanLib.getLoanById(loans, loan_id)) {
      case null { [] };
      case (?loan) {
        if (not Principal.equal(loan.given_by, caller)) {
          []
        } else {
          LoanLib.getRepaymentsForLoan(repayments, loan_id)
        }
      };
    }
  };

  public shared ({ caller }) func deleteLoan(id : CommonTypes.LoanId) : async Types.Result<(), Text> {
    // Only allow deletion if no repayments exist
    let loanRepayments = LoanLib.getRepaymentsForLoan(repayments, id);
    if (loanRepayments.size() > 0) {
      return #err("Cannot delete a loan with repayments")
    };
    LoanLib.removeLoan(loans, id, caller)
  };

};
