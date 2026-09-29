// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title InvestigationRegistry
 * @dev Smart contract for registering and managing cryptocurrency wallet risk investigations.
 * Designed for BlockTrace DApp (Educational Blockchain Project).
 */
contract InvestigationRegistry {
    struct Investigation {
        uint256 id;
        address walletAddress;
        uint256 riskScore;
        string riskLevel;
        string primaryReason;
        uint256 timestamp;
        address investigator;
    }

    // Counter for unique investigation IDs
    uint256 private _investigationCounter;

    // Mapping from Investigation ID to Investigation struct
    mapping(uint256 => Investigation) private _investigations;

    // Mapping from wallet address to array of investigation IDs
    mapping(address => uint256[]) private _walletInvestigations;

    // Array of all investigation IDs for easy iteration
    uint256[] private _allInvestigationIds;

    // Event emitted when a new investigation is registered on-chain
    event InvestigationRegistered(
        uint256 indexed id,
        address indexed walletAddress,
        uint256 riskScore,
        string riskLevel,
        uint256 timestamp,
        address indexed investigator
    );

    /**
     * @notice Register a new wallet risk analysis investigation.
     * @param walletAddress The cryptocurrency wallet address being investigated.
     * @param riskScore Calculated risk score (0 - 100).
     * @param riskLevel Risk level classification ("LOW RISK", "MEDIUM RISK", "HIGH RISK").
     * @param primaryReason Key indicator or summary explanation for the risk score.
     * @return investigationId The newly assigned investigation ID.
     */
    function registerInvestigation(
        address walletAddress,
        uint256 riskScore,
        string memory riskLevel,
        string memory primaryReason
    ) external returns (uint256) {
        require(walletAddress != address(0), "Invalid target wallet address");
        require(riskScore <= 100, "Risk score must be between 0 and 100");
        require(bytes(riskLevel).length > 0, "Risk level cannot be empty");

        _investigationCounter++;
        uint256 newId = _investigationCounter;

        Investigation memory newRecord = Investigation({
            id: newId,
            walletAddress: walletAddress,
            riskScore: riskScore,
            riskLevel: riskLevel,
            primaryReason: primaryReason,
            timestamp: block.timestamp,
            investigator: msg.sender
        });

        _investigations[newId] = newRecord;
        _walletInvestigations[walletAddress].push(newId);
        _allInvestigationIds.push(newId);

        emit InvestigationRegistered(
            newId,
            walletAddress,
            riskScore,
            riskLevel,
            block.timestamp,
            msg.sender
        );

        return newId;
    }

    /**
     * @notice Retrieve an investigation by its ID.
     * @param investigationId The ID of the investigation to fetch.
     */
    function getInvestigation(uint256 investigationId)
        external
        view
        returns (
            uint256 id,
            address walletAddress,
            uint256 riskScore,
            string memory riskLevel,
            string memory primaryReason,
            uint256 timestamp,
            address investigator
        )
    {
        require(investigationId > 0 && investigationId <= _investigationCounter, "Investigation does not exist");
        Investigation memory inv = _investigations[investigationId];
        return (
            inv.id,
            inv.walletAddress,
            inv.riskScore,
            inv.riskLevel,
            inv.primaryReason,
            inv.timestamp,
            inv.investigator
        );
    }

    /**
     * @notice Get total count of investigations registered on-chain.
     */
    function getTotalInvestigations() external view returns (uint256) {
        return _investigationCounter;
    }

    /**
     * @notice Fetch all registered investigations.
     */
    function getAllInvestigations() external view returns (Investigation[] memory) {
        Investigation[] memory allInv = new Investigation[](_investigationCounter);
        for (uint256 i = 0; i < _investigationCounter; i++) {
            allInv[i] = _investigations[i + 1];
        }
        return allInv;
    }

    /**
     * @notice Fetch investigation IDs associated with a specific wallet address.
     * @param walletAddress Address to query.
     */
    function getInvestigationsByWallet(address walletAddress)
        external
        view
        returns (uint256[] memory)
    {
        return _walletInvestigations[walletAddress];
    }
}
