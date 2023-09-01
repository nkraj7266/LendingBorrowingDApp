// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LendingPlatform {
    // Define the state variables
    uint256 public interestRate;
    uint256 public collateralRatio;
    uint256 public totalBorrowed;
    mapping(address => uint256) public balances;
    mapping(address => uint256) public loans;

    // Event for tracking borrow and repay actions
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event Borrow(address indexed user, uint256 amount);
    event Repay(address indexed user, uint256 amount);

    // Constructor to initialize the contract
    constructor(uint256 _interestRate, uint256 _collateralRatio) {
        interestRate = _interestRate;
        collateralRatio = _collateralRatio;
    }

    // Function to deposit Ether into the platform
    function deposit() external payable {
        // Update the sender's balance
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    // Function to withdraw Ether from the platform
    function withdraw(uint256 _amount) external {
        // Check that the sender has enough balance
        require(balances[msg.sender] >= _amount, "Insufficient balance");

        // Update the sender's balance
        balances[msg.sender] -= _amount;

        // Transfer the Ether from this contract to the sender
        payable(msg.sender).transfer(_amount*1e18);

        emit Withdraw(msg.sender, _amount);
    }

    // Function to borrow Ether from the platform
    function borrow(uint256 _amount) external {
        // Calculate the collateral required for the loan
        uint256 collateral = ((_amount * 100) / collateralRatio);

        // Check that the sender has enough balance as collateral
        require(balances[msg.sender] >= collateral, "Insufficient collateral");

        // Update the sender's balance and loan amount
        balances[msg.sender] -= collateral;
        loans[msg.sender] += _amount;
        totalBorrowed += _amount;

        // Transfer the Ether from this contract to the sender
        payable(msg.sender).transfer(_amount);

        emit Borrow(msg.sender, _amount);
    }

    // Function to repay a loan
    function repay() external payable {
        // Check that the sender has an outstanding loan
        require(loans[msg.sender] > 0, "No outstanding loan");

        uint256 amount = msg.value;

        // Calculate the interest on the loan
        uint256 interest = (loans[msg.sender] * interestRate) / 100;

        // Check that the sender is repaying at least the interest amount
        require(amount >= interest, "Must repay at least the interest");

        // Update the sender's loan amount and balance
        loans[msg.sender] -= amount;
        balances[msg.sender] += (amount - interest);
        totalBorrowed -= amount;

        emit Repay(msg.sender, amount);
    }
    
    // Function to get the contract's balance
    function contractBalance() public view returns(uint256)
    {
        return address(this).balance;
    }
}
