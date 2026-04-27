import List "mo:core/List";
import LoanTypes "types/loan";
import LoanApi "mixins/loan-api";
import Migration "migration";

(with migration = Migration.run)
actor {
  let loans = List.empty<LoanTypes.Loan>();
  let repayments = List.empty<LoanTypes.Repayment>();
  let loanCounter = { var val : Nat = 1 };
  let repaymentCounter = { var val : Nat = 1 };

  include LoanApi(loans, repayments, loanCounter, repaymentCounter);
};
