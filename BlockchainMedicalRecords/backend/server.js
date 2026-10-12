const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

const app = express();

app.use(cors());
app.use(express.json());

const RPC_URL = "http://127.0.0.1:7545";
const deploymentPath = path.join(__dirname, "..", "blockchain", "deployment.json");

let contractAddress = "PASTE_CONTRACT_ADDRESS_HERE";

if (fs.existsSync(deploymentPath)) {
    try {
        const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
        if (deployment.contractAddress) {
            contractAddress = deployment.contractAddress;
        }
    } catch (e) {
        console.log("Could not read deployment.json");
    }
}

const provider = new ethers.JsonRpcProvider(RPC_URL);

const ABI = [
    "function recordCount() view returns (uint256)",
    "function checkAccess(address,address) view returns (bool)",
    "function getRecord(uint256) view returns (uint256,address,string,string,uint256)"
];

const contract = () =>
    new ethers.Contract(contractAddress, ABI, provider);

app.get("/", (req, res) => {
    res.json({
        application: "Blockchain Medical Records",
        status: "running",
        contractAddress
    });
});

app.get("/api/records/count", async (req, res) => {
    try {
        const count = await contract().recordCount();
        res.json({ count: count.toString() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/api/records/:id", async (req, res) => {
    try {
        const record = await contract().getRecord(req.params.id);

        res.json({
            id: record[0].toString(),
            patient: record[1],
            recordHash: record[2],
            recordType: record[3],
            timestamp: new Date(Number(record[4]) * 1000).toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/api/access", async (req, res) => {
    try {
        const { patient, doctor } = req.query;

        if (!patient || !doctor) {
            return res.status(400).json({
                error: "patient and doctor query parameters are required"
            });
        }

        const allowed = await contract().checkAccess(patient, doctor);
        res.json({ patient, doctor, allowed });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => {
    console.log("Backend running at http://localhost:5000");
    console.log("Contract:", contractAddress);
});
