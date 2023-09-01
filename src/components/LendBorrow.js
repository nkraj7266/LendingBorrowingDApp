import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const LendBorrow = ({ state }) => {
	const { contract } = state;

	// Set initial account state using the useState hook
	const [depositAmount, setDepositAmount] = useState("");
	const [borrowAmount, setBorrowAmount] = useState("");
	const [repayAmount, setRepayAmount] = useState("");
	const [withdrawAmount, setWithdrawAmount] = useState("");
	const [contractBalance, setContractBalance] = useState(null);

	useEffect(() => {
		fetchContractBalance();
	}, [contract]);

	// Deposit funds into the contract
	const handleDeposit = async () => {
		const amount = ethers.parseEther(depositAmount);

		try {
			const tx = await contract.deposit({ value: amount });
			await tx.wait();
			fetchContractBalance();
			setDepositAmount("");
		} catch (error) {
			console.error("Error depositing funds:", error);
		}
	};

	// Borrow funds from the contract
	const handleBorrow = async () => {
		const amount = ethers.parseEther(borrowAmount);

		try {
			const tx = await contract.borrow(amount, { value: amount });
			await tx.wait();
			fetchContractBalance();
			setBorrowAmount("");
		} catch (error) {
			console.error("Error borrowing funds:", error);
		}
	};

	// Repay the borrower's balance
	const handleRepay = async () => {
		const amount = ethers.parseEther(repayAmount);

		try {
			const tx = await contract.repay({ value: amount });
			await tx.wait();
			fetchContractBalance();
			setRepayAmount("");
		} catch (error) {
			console.error("Error repaying funds:", error);
		}
	};

	// Withdraw the lender's balance
	const handleWithdraw = async () => {
		const amount = ethers.parseEther(withdrawAmount);

		try {
			const tx = await contract.withdraw({ value: amount });
			await tx.wait();
			fetchContractBalance();
			setWithdrawAmount("");
		} catch (error) {
			console.error("Error withdrawing funds:", error);
		}
	};

	// Fetch the contract balance
	const fetchContractBalance = async () => {
		try {
			const balance = await contract.contractBalance();
			setContractBalance(balance);
		} catch (error) {
			console.error("Error fetching contract balance:", error);
		}
	};

	return (
		<div>
			<h2>Lending Platform</h2>
			<div>
				<h3>Deposit</h3>
				<input
					type="number"
					placeholder="Amount to deposit"
					value={depositAmount}
					onChange={(e) => setDepositAmount(e.target.value)}
				/>
				<button onClick={handleDeposit}>Deposit</button>
			</div>

			<div>
				<h3>Borrow</h3>
				<input
					type="number"
					placeholder="Amount to borrow"
					value={borrowAmount}
					onChange={(e) => setBorrowAmount(e.target.value)}
				/>
				<button onClick={handleBorrow}>Borrow</button>
			</div>

			<div>
				<h3>Repay</h3>
				<input
					type="number"
					placeholder="Amount to repay"
					value={repayAmount}
					onChange={(e) => setRepayAmount(e.target.value)}
				/>
				<button onClick={handleRepay}>Repay</button>
			</div>

			<div>
				<h3>Withdraw</h3>
				<input
					type="number"
					placeholder="Amount to be Withdrawn"
					value={withdrawAmount}
					onChange={(e) => setWithdrawAmount(e.target.value)}
				/>
				<button onClick={handleWithdraw}>Withdraw</button>
			</div>

			<div>
				<h3>Contract Balance</h3>
				<p>
					{contractBalance !== null
						? ethers.formatEther(contractBalance) + " Ether"
						: "Loading..."}
				</p>
			</div>
		</div>
	);
};

export default LendBorrow;
