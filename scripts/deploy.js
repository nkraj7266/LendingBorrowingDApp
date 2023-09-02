const { ethers } = require("hardhat");

async function main() {
	const [deployer] = await ethers.getSigners();

	// Console log the address of the account that will deploy the contract
	console.log(
		"Deploying contracts with the account:",
		await deployer.address
	);

	// Deploy the LendingPlatform contract
	const LendingPlatform = await ethers.getContractFactory("LendingPlatform");
	const lendingPlatform = await LendingPlatform.deploy();

	// Wait for the contract to be deployed
	await lendingPlatform.waitForDeployment();

	// Console log the address where the contract was deployed
	console.log(
		"LendingPlatform deployed to:",
		await lendingPlatform.getAddress()
	);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
