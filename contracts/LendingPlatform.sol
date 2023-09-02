// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract LendingPlatform {
    // Annual interest rate for borrowers
    uint256 public borrowerInterestRate;
    // Annual interest rate for lenders
    uint256 public lenderInterestRate;
    // total borrowed amount
    uint256 public borrowedTotal;

    struct Loan {
        address borrower;
        uint256 principal;
        uint256 collateral;
        uint256 borrowDate;
    }
    struct Lend {
        address lender;
        uint256 principal;
        uint256 lentDate;
    }

    mapping(address => Loan) public loans;
    mapping(address => Lend) public lends;

    event Borrowed(address indexed borrower, uint256 principal);
    event Lent(address indexed lender, uint256 amount);
    event Repaid(address indexed borrower, uint256 amount);
    event Withdrawn(address indexed lender, uint256 amount);

    constructor() {
        borrowerInterestRate = 4;
        lenderInterestRate = 2;
    }

    function lend() external payable {
        require(msg.value > 0, "You must send some funds to lend");
        require(msg.value < msg.sender.balance, "You hve insufficient funds");

        uint256 _lentDate = block.timestamp;

        lends[msg.sender] = Lend({
            lender: msg.sender,
            principal: msg.value + lends[msg.sender].principal,
            lentDate: _lentDate
        });

        emit Lent(msg.sender, msg.value);
    }

    function borrow(uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than 0");

        uint256 _collateral = (_amount/100)*120;

        require(_collateral <= msg.sender.balance, "Collateral must be less than your balance");
        require(address(this).balance >= _amount, "Sorry, Insufficient funds in contract");

        uint256 _borrowDate = block.timestamp;

        loans[msg.sender] = Loan({
            borrower: msg.sender,
            principal: _amount + loans[msg.sender].principal,
            collateral: _collateral + loans[msg.sender].collateral,
            borrowDate: _borrowDate
        });

        borrowedTotal += _amount;

        if (_amount <= address(this).balance) {
            // Transfer borrowed amount directly to borrower's address
            payable(msg.sender).transfer(_amount);
        }

        emit Borrowed(msg.sender, _amount);
    }

    function repay() external payable {
        Loan storage loan = loans[msg.sender];
        require(loan.principal > 0, "No active loan found");

        uint256 _amount = msg.value;
        uint256 interest = calculateInterest(loan.principal, borrowerInterestRate);

        require(_amount >= interest, "Insufficient repayment amount, repay at least the interest");

        loan.principal += calculateInterest(loan.principal, borrowerInterestRate);

        if(_amount > loan.principal){
            uint256 excess = _amount - loan.principal;
            // Send excess back to borrower
            payable(msg.sender).transfer(excess);
            borrowedTotal -= loan.principal;
            emit Repaid(msg.sender, loan.principal);
            loan.principal = 0;
            loan.collateral = 0;
        }
        else {
            borrowedTotal -= _amount;
            loan.principal -= _amount;
            loan.collateral -= (_amount / 100) * 120;
            emit Repaid(msg.sender, _amount);
        }
    }

    function withdraw(uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than 0");

        lends[msg.sender].principal += calculateInterest(lends[msg.sender].principal, lenderInterestRate);

        require(lends[msg.sender].principal >= _amount, "Sorry, insufficient funds in your account");

        payable(msg.sender).transfer(_amount);
        lends[msg.sender].principal -= _amount;

        emit Withdrawn(msg.sender, _amount);
    }

    function calculateInterest(uint256 _amount, uint256 _interestRate) internal pure returns (uint256) {
        return (_amount * _interestRate) / 100;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getUsersLends() external view returns (uint256) {
        return lends[msg.sender].principal;
    }

    function getUsersLoans() external view returns (uint256) {
        return loans[msg.sender].principal;
    }

    function getUsersCollateral() external view returns (uint256) {
        return loans[msg.sender].collateral;
    }
}
