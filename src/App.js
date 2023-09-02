import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import LendBorrow from "./components/LendBorrow";
import LendingPlatform from "./artifacts/contracts/LendingPlatform.sol/LendingPlatform.json";

function App() {
	const [state, setState] = useState({
		provider: null,
		signer: null,
		contract: null,
	});
	const [connected, setConnected] = useState(false);
	const [account, setAccount] = useState("Metamask is Not Connected!");

	
	// Set initial account state using the useState hook
	const { ethereum } = window;

	const connectWallet = async () => {
		const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
		const contractABI = LendingPlatform.abi;

		try {
			// Check if Metamask is installed
			if (ethereum) {
				const accounts = await ethereum.request({method: "eth_requestAccounts",});
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
				setAccount(accounts);
				setState({
					provider,
					signer,
					contract,
				});
				setConnected(true); // Set connection status to true
			} else {
				alert("First Install MetaMask!");
				return;
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		// <div className={Styles["quality-card-img"]}></div>
		<div className="App">
			<button
				className="btn-conct"
				onClick={connectWallet}
				disabled={connected}
			>
				{connected ? "Connected" : "Connect to Wallet"}
			</button>
			<div className="App-header">
				{connected && (
					<div className="user-addrs">
						<p>
							<strong>Connected Address:</strong> {account}
						</p>
					</div>
				)}
				<div>
					<LendBorrow state={state} account={account} />
				</div>
			</div>
		</div>
	);
}

export default App;
