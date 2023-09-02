import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./LendBorrow.css";

const LendBorrow = (props) => {
	const {contract} = props.state;
	const currentUserAddress = props.account;

	// Set initial account state using the useState hook
	const [depositAmount, setDepositAmount] = useState("");
	const [borrowAmount, setBorrowAmount] = useState("");
	const [repayAmount, setRepayAmount] = useState("");
	const [withdrawAmount, setWithdrawAmount] = useState("");
	const [contractBalance, setContractBalance] = useState(null);
	const [borrowedTotal, setBorrowedTotal] = useState(null);
	const [lenderInterestRate, setLenderInterestRate] = useState(null);
	const [borrowerInterestRate, setBorrowerInterestRate] = useState(null);
	const [userLoan, setUserLoan] = useState(null);
	const [userCollateral, setUserCollateral] = useState(null);
	const [userLend, setUserLend] = useState(null);

	useEffect(() => {
		fetchContractBalance();
		fetchBorrowedTotal();
		fetchInterestRates();
		fetchUserLoan();
		fetchUserLend();
	}, [contract, currentUserAddress]);

	// Deposit funds into the contract
	const handleDeposit = async () => {
		// const amount = ethers.parseEther(depositAmount);
		try {
			const tx = await contract.lend({ value: depositAmount });

			// Handling lending event
			contract.on("Lent", (currentUserAddress, depositAmount, event) => {
				let info = {
					from: currentUserAddress,
					amount: ethers.formatUnits(depositAmount, 18),
					event: event,
				};
				console.log(JSON.stringify(info, null, 4));
			});

			await tx.wait();
			fetchContractBalance();
			fetchUserLend();
			setDepositAmount("");
		} catch (error) {
			console.error("Error depositing funds:", error);
		}
	};

	// Withdraw the lender's balance
	const handleWithdraw = async () => {
		// const amount = ethers.parseEther(withdrawAmount);
		try {
			const tx = await contract.withdraw(withdrawAmount);

			// Handling withdrawing event
			contract.on("Withdrawn", (currentUserAddress, withdrawAmount, event) => {
				let info = {
					from: currentUserAddress,
					amount: ethers.formatUnits(withdrawAmount, 18),
					event: event,
				};
				console.log(JSON.stringify(info, null, 4));
			});

			await tx.wait();
			fetchContractBalance();
			fetchUserLend();
			setWithdrawAmount("");
		} catch (error) {
			console.error("Error withdrawing funds:", error);
		}
	};

	// Borrow funds from the contract
	const handleBorrow = async () => {
		// const amount = ethers.parseEther(borrowAmount);
		try {
			const tx = await contract.borrow(borrowAmount);

			// Handling borrowing event
			contract.on("Borrowed", (currentUserAddress, borrowAmount, event) => {
				let info = {
					from: currentUserAddress,
					amount: ethers.formatUnits(borrowAmount, 18),
					event: event,
				};
				console.log(JSON.stringify(info, null, 4));
			});

			await tx.wait();
			fetchContractBalance();
			fetchBorrowedTotal();
			fetchUserLoan();
			setBorrowAmount("");
		} catch (error) {
			console.error("Error borrowing funds:", error);
		}
	};

	// Repay the borrower's balance
	const handleRepay = async () => {
		// const amount = ethers.parseEther(repayAmount);
		try {
			const tx = await contract.repay({ value: repayAmount });

			// Handling repaying event
			contract.on("Repaid", (currentUserAddress, repayAmount, event) => {
				let info = {
					from: currentUserAddress,
					amount: ethers.formatUnits(repayAmount, 18),
					event: event,
				};
				console.log(JSON.stringify(info, null, 4));
			});

			await tx.wait();
			fetchContractBalance();
			fetchBorrowedTotal();
			fetchUserLoan();
			setRepayAmount("");
		} catch (error) {
			console.error("Error repaying funds:", error);
		}
	};

	// Fetching total contract balance
	const fetchContractBalance = async () => {
		try {
			const balance = await contract.getContractBalance();
			setContractBalance(balance);
		} catch (error) {
			console.error("Error fetching contract balance:", error);
		}
	};

	// Fetching borrowedTotal amount
	const fetchBorrowedTotal = async () => {
		try {
			const total = await contract.borrowedTotal();
			setBorrowedTotal(total);
		} catch (error) {
			console.error("Error fetching borrowed total:", error);
		}
	};

	// Fetching the interest rates
	const fetchInterestRates = async () => {
		try {
			const lenderRate = await contract.lenderInterestRate();
			const borrowerRate = await contract.borrowerInterestRate();
			setLenderInterestRate(lenderRate);
			setBorrowerInterestRate(borrowerRate);
		} catch (error) {
			console.error("Error fetching interest rates:", error);
		}
	};

	// Fetching user's loan details
	const fetchUserLoan = async () => {
		try {
			const loan = await contract.getUsersLoans();
			const collateral = await contract.getUsersCollateral();
			setUserCollateral(collateral);
			setUserLoan(loan);
		} catch (error) {
			console.error("Error fetching user's loan details:", error);
		}
	};

	// Fetching user's lend details
	const fetchUserLend = async () => {
		try {
			const lend = await contract.getUsersLends();
			setUserLend(lend);
		} catch (error) {
			console.error("Error fetching user's lend details:", error);
		}
	};

	return (
		<div>
			<div className="rates-container">
				<div className="rates-data">
					<h3>Lending Interest: </h3>
					<p>
						{lenderInterestRate !== null
							? lenderInterestRate.toString() + "%"
							: "Loading..."}
					</p>
				</div>

				<div className="rates-data">
					<h3>Borrowing Interest: </h3>
					<p>
						{borrowerInterestRate !== null
							? borrowerInterestRate.toString() + "%"
							: "Loading..."}
					</p>
				</div>
			</div>

			<div className="txns-container">
				<div className="txn-box">
					<div className="txn-form-box">
						<h3>Deposit</h3>
						<input
							type="number"
							className="txn-input"
							placeholder="Amount to deposit"
							value={depositAmount}
							onChange={(e) => setDepositAmount(e.target.value)}
						/>
						<button onClick={handleDeposit} className="txn-btn">
							Deposit
						</button>
					</div>

					<div className="txn-form-box">
						<h3>Withdraw</h3>
						<input
							type="number"
							className="txn-input"
							placeholder="Amount to be Withdrawn"
							value={withdrawAmount}
							onChange={(e) => setWithdrawAmount(e.target.value)}
						/>
						<button onClick={handleWithdraw} className="txn-btn">
							Withdraw
						</button>
					</div>

					<div className="lend-data-box">
						<div className="lend-data">
							<h3>Lend Amount: </h3>
							<p>
								{userLend !== null
									? userLend.toString() + " Wei"
									: "Loading..."}
							</p>
						</div>
					</div>
				</div>

				<div className="txn-box">
					<div className="txn-form-box">
						<h3>Borrow</h3>
						<input
							type="number"
							className="txn-input"
							placeholder="Amount to borrow"
							value={borrowAmount}
							onChange={(e) => setBorrowAmount(e.target.value)}
						/>
						<button onClick={handleBorrow} className="txn-btn">
							Borrow
						</button>
					</div>

					<div className="txn-form-box">
						<h3>Repay</h3>
						<input
							type="number"
							className="txn-input"
							placeholder="Amount to repay"
							value={repayAmount}
							onChange={(e) => setRepayAmount(e.target.value)}
						/>
						<button onClick={handleRepay} className="txn-btn">
							Repay
						</button>
					</div>

					<div className="loan-data-box">
						<div className="loan-data">
							<h3>Loan Amount: </h3>
							<p>
								{userLoan !== null
									? userLoan.toString() + " Wei"
									: "Loading..."}
							</p>
						</div>

						<div className="loan-data">
							<h3>Collateral Amount: </h3>
							<p>
								{userCollateral !== null
									? userCollateral.toString() + " Wei"
									: "Loading..."}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="balance-container">
				<div className="balance-data">
					<h3>Current Contract Balance : </h3>
					<p>
						{contractBalance !== null
							? ethers.formatEther(contractBalance) + " ETH"
							: "Loading..."}
					</p>
				</div>

				<div className="balance-data">
					<h3>Borrowed Total: </h3>
					<p>
						{borrowedTotal !== null
							? borrowedTotal.toString() + " Wei"
							: "Loading..."}
					</p>
				</div>
			</div>
		</div>
	);
};

export default LendBorrow;
