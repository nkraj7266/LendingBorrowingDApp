import "./App.css";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import LendBorrow1 from "./components/LendBorrow";
import LendingPlatform from "./artifacts/contracts/LendingPlatform.sol/LendingPlatform.json";

function App() {
	const [state, setState] = useState({
		provider: null,
		signer: null,
		contract: null,
	});

	// Set initial account state using the useState hook
	const [account, setAccount] = useState("Install Metamask extension");

	useEffect(() => {
		const connectWallet = async () => {
			const contractAddress =
				"0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";
			const contractABI = LendingPlatform.abi;

			try {
				const { ethereum } = window;

        // Check if Metamask is installed
				if (ethereum) {
					const account = await ethereum.request({
						method: "eth_requestAccounts",
					});
					console.log("We have the ethereum object", ethereum);

          // Reload the page if the chain is changed
					window.ethereum.on("chainChanged", () => {
						window.location.reload();
					});

					// Reload the page if the user changes accounts
					window.ethereum.on("accountsChanged", () => {
						window.location.reload();
					});

          // Create a new provider from Metamask
					const provider = new ethers.BrowserProvider(ethereum);
					const signer = await provider.getSigner();
					console.log(
						"Deploying contracts with the account:",
						signer.address
					);

          // Create a new contract instance with the provider
					const contract = new ethers.Contract(
						contractAddress,
						contractABI,
						signer
					);

					console.log(
						"LendingPlatform deployed to:",
						contractAddress
					);

					// Set the user account and state
					setAccount(account);
					setState({
						provider,
						signer,
						contract,
					});
				} else {
					alert("Get MetaMask!");
					return;
				}
			} catch (err) {
				console.log(err);
			}
		};
		connectWallet();
	}, []);

	console.log(state);

	return (
		<div className="App">
			<div>Nitin Rajvanshi's App</div>
			<div>User Account Address : {account}</div>
			<div>
				<LendBorrow1 state={state} account={account} />
			</div>
		</div>
	);
}

export default App;
