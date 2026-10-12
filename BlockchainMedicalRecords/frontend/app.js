let provider;
let signer;
let contract;

const CONTRACT_ADDRESS = "PASTE_CONTRACT_ADDRESS_HERE";

const ABI = [
    "function addRecord(string,string)",
    "function recordCount() view returns (uint256)",
    "function getRecord(uint256) view returns (uint256,address,string,string,uint256)",
    "function grantAccess(address)",
    "function revokeAccess(address)",
    "function checkAccess(address,address) view returns (bool)"
];

function requireWallet() {
    if (!contract) {
        alert("Connect MetaMask first.");
        return false;
    }
    return true;
}

async function connectWallet() {
    try {
        if (!window.ethereum) {
            alert("MetaMask is not installed.");
            return;
        }

        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);

        signer = await provider.getSigner();

        const address = await signer.getAddress();
        const network = await provider.getNetwork();

        document.getElementById("walletStatus").textContent =
            "Connected: " + address;

        document.getElementById("networkStatus").textContent =
            "Chain ID: " + network.chainId.toString();

        contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            ABI,
            signer
        );

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

async function hashFile(file) {
    const buffer = await file.arrayBuffer();
    const digest = await crypto.subtle.digest("SHA-256", buffer);

    return Array.from(new Uint8Array(digest))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

document.getElementById("fileInput").addEventListener("change", async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    try {
        const hash = await hashFile(file);
        document.getElementById("recordHash").value = hash;

        document.getElementById("addResult").textContent =
            "SHA-256 generated locally:\n" + hash;
    } catch (error) {
        alert("Could not hash file: " + error.message);
    }
});

async function addRecord() {
    if (!requireWallet()) return;

    try {
        const type = document.getElementById("recordType").value.trim();
        const hash = document.getElementById("recordHash").value.trim();

        if (!type || !hash) {
            alert("Enter record type and hash, or select a file.");
            return;
        }

        document.getElementById("addResult").textContent =
            "Waiting for MetaMask confirmation...";

        const tx = await contract.addRecord(hash, type);

        document.getElementById("addResult").textContent =
            "Transaction submitted:\n" + tx.hash +
            "\n\nWaiting for confirmation...";

        const receipt = await tx.wait();

        document.getElementById("addResult").textContent =
            "Record added successfully.\n" +
            "Transaction: " + receipt.hash;
    } catch (error) {
        console.error(error);
        document.getElementById("addResult").textContent =
            "Error: " + (error.shortMessage || error.message);
    }
}

async function viewRecord() {
    if (!requireWallet()) return;

    try {
        const id = document.getElementById("recordId").value;

        if (!id) {
            alert("Enter a record ID.");
            return;
        }

        const record = await contract.getRecord(id);

        document.getElementById("recordResult").textContent =
            "Record ID: " + record[0].toString() +
            "\nPatient: " + record[1] +
            "\nHash: " + record[2] +
            "\nType: " + record[3] +
            "\nTimestamp: " +
            new Date(Number(record[4]) * 1000).toLocaleString();
    } catch (error) {
        console.error(error);
        document.getElementById("recordResult").textContent =
            "Error: " + (error.shortMessage || error.message);
    }
}

async function grantAccess() {
    if (!requireWallet()) return;

    try {
        const doctor = document.getElementById("doctorAddress").value.trim();

        if (!ethers.isAddress(doctor)) {
            alert("Enter a valid doctor wallet address.");
            return;
        }

        const tx = await contract.grantAccess(doctor);
        document.getElementById("accessResult").textContent =
            "Grant transaction submitted...\n" + tx.hash;

        await tx.wait();

        document.getElementById("accessResult").textContent =
            "Access granted to:\n" + doctor;
    } catch (error) {
        console.error(error);
        document.getElementById("accessResult").textContent =
            "Error: " + (error.shortMessage || error.message);
    }
}

async function revokeAccess() {
    if (!requireWallet()) return;

    try {
        const doctor = document.getElementById("doctorAddress").value.trim();

        if (!ethers.isAddress(doctor)) {
            alert("Enter a valid doctor wallet address.");
            return;
        }

        const tx = await contract.revokeAccess(doctor);
        document.getElementById("accessResult").textContent =
            "Revoke transaction submitted...\n" + tx.hash;

        await tx.wait();

        document.getElementById("accessResult").textContent =
            "Access revoked for:\n" + doctor;
    } catch (error) {
        console.error(error);
        document.getElementById("accessResult").textContent =
            "Error: " + (error.shortMessage || error.message);
    }
}

async function checkAccess() {
    if (!requireWallet()) return;

    try {
        const patient =
            document.getElementById("patientAddress").value.trim();

        const doctor =
            document.getElementById("checkDoctorAddress").value.trim();

        if (!ethers.isAddress(patient) || !ethers.isAddress(doctor)) {
            alert("Enter valid patient and doctor addresses.");
            return;
        }

        const allowed = await contract.checkAccess(patient, doctor);

        document.getElementById("checkResult").textContent =
            allowed
                ? "ACCESS GRANTED"
                : "ACCESS DENIED";
    } catch (error) {
        console.error(error);
        document.getElementById("checkResult").textContent =
            "Error: " + (error.shortMessage || error.message);
    }
}

document.getElementById("connectBtn").onclick = connectWallet;
document.getElementById("addBtn").onclick = addRecord;
document.getElementById("viewBtn").onclick = viewRecord;
document.getElementById("grantBtn").onclick = grantAccess;
document.getElementById("revokeBtn").onclick = revokeAccess;
document.getElementById("checkBtn").onclick = checkAccess;
