const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const MedicalRecords =
        await hre.ethers.getContractFactory("MedicalRecords");

    const medicalRecords =
        await MedicalRecords.deploy();

    await medicalRecords.waitForDeployment();

    const address =
        await medicalRecords.getAddress();

    console.log("\n======================================");
    console.log("MedicalRecords deployed successfully");
    console.log("Contract address:", address);
    console.log("======================================\n");

    const deployment = {
        contractAddress: address,
        network: "ganache",
        rpcUrl: "http://127.0.0.1:7545"
    };

    fs.writeFileSync(
        path.join(__dirname, "..", "deployment.json"),
        JSON.stringify(deployment, null, 2)
    );

    console.log("Saved: blockchain/deployment.json");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
