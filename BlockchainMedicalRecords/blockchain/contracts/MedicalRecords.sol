// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MedicalRecords {
    struct Record {
        uint256 id;
        address patient;
        string recordHash;
        string recordType;
        uint256 timestamp;
    }

    uint256 public recordCount;

    mapping(uint256 => Record) public records;
    mapping(address => mapping(address => bool)) public accessPermission;

    event RecordAdded(
        uint256 indexed recordId,
        address indexed patient,
        string recordHash,
        string recordType
    );

    event AccessGranted(
        address indexed patient,
        address indexed doctor
    );

    event AccessRevoked(
        address indexed patient,
        address indexed doctor
    );

    function addRecord(
        string memory _recordHash,
        string memory _recordType
    ) public {
        recordCount++;

        records[recordCount] = Record(
            recordCount,
            msg.sender,
            _recordHash,
            _recordType,
            block.timestamp
        );

        emit RecordAdded(
            recordCount,
            msg.sender,
            _recordHash,
            _recordType
        );
    }

    function grantAccess(address _doctor) public {
        require(_doctor != address(0), "Invalid doctor address");
        require(_doctor != msg.sender, "Patient cannot grant self access");

        accessPermission[msg.sender][_doctor] = true;
        emit AccessGranted(msg.sender, _doctor);
    }

    function revokeAccess(address _doctor) public {
        accessPermission[msg.sender][_doctor] = false;
        emit AccessRevoked(msg.sender, _doctor);
    }

    function checkAccess(
        address _patient,
        address _doctor
    ) public view returns (bool) {
        return accessPermission[_patient][_doctor];
    }

    function getRecord(uint256 _recordId)
        public
        view
        returns (
            uint256,
            address,
            string memory,
            string memory,
            uint256
        )
    {
        require(_recordId > 0 && _recordId <= recordCount, "Record does not exist");

        Record memory record = records[_recordId];

        return (
            record.id,
            record.patient,
            record.recordHash,
            record.recordType,
            record.timestamp
        );
    }
}
