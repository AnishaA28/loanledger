import List "mo:core/List";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Types "../types/loan";

module {
  public type Loan = Types.Loan;
  public type Repayment = Types.Repayment;
  public type LoanId = Types.LoanId;
  public type RepaymentId = Types.RepaymentId;
  public type LoanStatus = Types.LoanStatus;

  // Convert Time.now() (nanoseconds Int) to a YYYY-MM-DD date string
  public func nowToDateText(now : Int) : Text {
    // Days since Unix epoch (1970-01-01)
    let secondsPerDay : Int = 86400;
    let totalDays : Int = now / 1_000_000_000 / secondsPerDay;

    // Gregorian calendar computation
    var z : Int = totalDays + 719468;
    let era : Int = (if (z >= 0) z else z - 146096) / 146097;
    let doe : Int = z - era * 146097;
    let yoe : Int = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365;
    let y : Int = yoe + era * 400;
    let doy : Int = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp : Int = (5 * doy + 2) / 153;
    let d : Int = doy - (153 * mp + 2) / 5 + 1;
    let m : Int = mp + (if (mp < 10) 3 else -9);
    let yr : Int = y + (if (m <= 2) 1 else 0);

    let pad2 = func(n : Int) : Text {
      if (n < 10) "0" # intToText(n) else intToText(n)
    };
    intToText(yr) # "-" # pad2(m) # "-" # pad2(d)
  };

  // Simple Int to Text (non-negative integers only for our use)
  func intToText(n : Int) : Text {
    if (n == 0) return "0";
    var result = "";
    var x : Int = if (n < 0) { -n } else { n };
    let digits = ["0","1","2","3","4","5","6","7","8","9"];
    while (x > 0) {
      let digit : Nat = Int.abs(x % 10);
      result := digits[digit] # result;
      x := x / 10;
    };
    if (n < 0) "-" # result else result
  };

  public func computeStatus(pending_amount : Nat) : LoanStatus {
    if (pending_amount == 0) #completed else #active
  };

  public func createLoan(
    loans : List.List<Loan>,
    nextId : Nat,
    caller : Principal,
    given_to : Text,
    amount_given : Nat,
    given_date : Text,
    notes : Text,
    now : Int,
  ) : Loan {
    let status = computeStatus(amount_given);
    let loan : Loan = {
      id = nextId;
      amount_given;
      given_by = caller;
      given_to;
      given_date;
      total_returned = 0;
      pending_amount = amount_given;
      status;
      notes;
      created_at = now;
    };
    loans.add(loan);
    loan
  };

  public func getLoansForCaller(loans : List.List<Loan>, caller : Principal) : [Loan] {
    let filtered = loans.filter(func(l) { Principal.equal(l.given_by, caller) });
    // Sort newest first by created_at (descending)
    let arr = filtered.toArray();
    arr.sort(func(a : Loan, b : Loan) : { #less; #equal; #greater } {
      Int.compare(b.created_at, a.created_at)
    })
  };

  public func getLoanById(loans : List.List<Loan>, id : LoanId) : ?Loan {
    loans.find(func(l) { l.id == id })
  };

  public func applyRepayment(
    loans : List.List<Loan>,
    loan_id : LoanId,
    amount_returned : Nat,
  ) : Types.Result<Loan, Text> {
    let existing = loans.find(func(l) { l.id == loan_id });
    switch (existing) {
      case null { #err("Loan not found") };
      case (?loan) {
        if (amount_returned > loan.pending_amount) {
          return #err("Repayment amount exceeds pending amount")
        };
        let new_total_returned = loan.total_returned + amount_returned;
        let new_pending = loan.amount_given - new_total_returned;
        let new_status = computeStatus(new_pending);
        let updated : Loan = {
          loan with
          total_returned = new_total_returned;
          pending_amount = new_pending;
          status = new_status;
        };
        loans.mapInPlace(func(l) {
          if (l.id == loan_id) updated else l
        });
        #ok(updated)
      };
    }
  };

  public func removeLoan(loans : List.List<Loan>, id : LoanId, caller : Principal) : Types.Result<(), Text> {
    let existing = loans.find(func(l) { l.id == id });
    switch (existing) {
      case null { #err("Loan not found") };
      case (?loan) {
        if (not Principal.equal(loan.given_by, caller)) {
          return #err("Not authorized to delete this loan")
        };
        // Remove by filtering out the matching id
        let remaining = loans.filter(func(l) { l.id != id });
        loans.clear();
        loans.append(remaining);
        #ok(())
      };
    }
  };

  public func createRepayment(
    repayments : List.List<Repayment>,
    nextId : Nat,
    loan_id : LoanId,
    amount_returned : Nat,
    return_date : Text,
    caller : Principal,
    notes : Text,
  ) : Repayment {
    let repayment : Repayment = {
      id = nextId;
      loan_id;
      amount_returned;
      return_date;
      returned_by = caller;
      notes;
    };
    repayments.add(repayment);
    repayment
  };

  public func getRepaymentsForLoan(repayments : List.List<Repayment>, loan_id : LoanId) : [Repayment] {
    repayments.filter(func(r) { r.loan_id == loan_id }).toArray()
  };
};
