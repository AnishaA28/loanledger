import CommonTypes "common";

module {
  public type LoanId = CommonTypes.LoanId;
  public type RepaymentId = CommonTypes.RepaymentId;
  public type Timestamp = CommonTypes.Timestamp;

  public type LoanStatus = { #active; #completed };

  public type Loan = {
    id : LoanId;
    amount_given : Nat;
    given_by : Principal;
    given_to : Text;
    given_date : Text;
    total_returned : Nat;
    pending_amount : Nat;
    status : LoanStatus;
    notes : Text;
    created_at : Timestamp;
  };

  public type Repayment = {
    id : RepaymentId;
    loan_id : LoanId;
    amount_returned : Nat;
    return_date : Text;
    returned_by : Principal;
    notes : Text;
  };

  public type CreateLoanArgs = {
    given_to : Text;
    amount_given : Nat;
    given_date : Text;
    notes : Text;
  };

  public type AddRepaymentArgs = {
    loan_id : LoanId;
    amount_returned : Nat;
    return_date : Text;
    notes : Text;
  };

  public type Result<T, E> = { #ok : T; #err : E };
};
