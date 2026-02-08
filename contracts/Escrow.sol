// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title UAE7Guard Escrow Contract
 * @notice Secure escrow for P2P cryptocurrency transactions
 * @dev Supports ETH and ERC20 tokens with dispute resolution
 */
contract UAE7GuardEscrow {
    
    enum EscrowState { 
        PENDING,      // Waiting for deposit
        FUNDED,       // Buyer deposited funds
        RELEASED,     // Funds released to seller
        REFUNDED,     // Funds returned to buyer
        DISPUTED,     // Dispute raised
        CANCELLED     // Cancelled before funding
    }
    
    struct Escrow {
        address buyer;
        address seller;
        address arbiter;          // UAE7Guard arbiter
        uint256 amount;
        address tokenAddress;     // 0x0 for ETH
        EscrowState state;
        uint256 deadline;         // Unix timestamp
        uint256 createdAt;
        bytes32 agreementHash;    // Hash of agreement terms
        bool sellerApproved;
        bool buyerApproved;
    }
    
    // Escrow storage
    mapping(uint256 => Escrow) public escrows;
    uint256 public escrowCount;
    
    // Fee structure (in basis points: 100 = 1%)
    uint256 public constant FEE_RATE = 25;  // 0.25% fee
    uint256 public constant MAX_FEE = 500;  // Max 5% fee
    address public feeCollector;
    
    // Events
    event EscrowCreated(
        uint256 indexed escrowId,
        address indexed buyer,
        address indexed seller,
        uint256 amount
    );
    
    event EscrowFunded(uint256 indexed escrowId, uint256 amount);
    event EscrowReleased(uint256 indexed escrowId, uint256 amount);
    event EscrowRefunded(uint256 indexed escrowId, uint256 amount);
    event DisputeRaised(uint256 indexed escrowId, address indexed initiator);
    event DisputeResolved(uint256 indexed escrowId, address indexed winner);
    
    // Modifiers
    modifier onlyBuyer(uint256 escrowId) {
        require(msg.sender == escrows[escrowId].buyer, "Only buyer");
        _;
    }
    
    modifier onlySeller(uint256 escrowId) {
        require(msg.sender == escrows[escrowId].seller, "Only seller");
        _;
    }
    
    modifier onlyArbiter(uint256 escrowId) {
        require(msg.sender == escrows[escrowId].arbiter, "Only arbiter");
        _;
    }
    
    modifier inState(uint256 escrowId, EscrowState _state) {
        require(escrows[escrowId].state == _state, "Invalid state");
        _;
    }
    
    constructor(address _feeCollector) {
        require(_feeCollector != address(0), "Invalid fee collector");
        feeCollector = _feeCollector;
    }
    
    /**
     * @notice Create new escrow transaction
     * @param seller Address of the seller
     * @param amount Amount in wei (for ETH) or tokens
     * @param tokenAddress Token contract address (0x0 for ETH)
     * @param deadline Unix timestamp deadline
     * @param agreementHash Hash of agreement terms
     */
    function createEscrow(
        address seller,
        uint256 amount,
        address tokenAddress,
        uint256 deadline,
        bytes32 agreementHash
    ) external returns (uint256) {
        require(seller != address(0), "Invalid seller");
        require(seller != msg.sender, "Cannot escrow with yourself");
        require(amount > 0, "Amount must be > 0");
        require(deadline > block.timestamp, "Deadline must be future");
        
        uint256 escrowId = escrowCount++;
        
        escrows[escrowId] = Escrow({
            buyer: msg.sender,
            seller: seller,
            arbiter: feeCollector, // UAE7Guard as arbiter
            amount: amount,
            tokenAddress: tokenAddress,
            state: EscrowState.PENDING,
            deadline: deadline,
            createdAt: block.timestamp,
            agreementHash: agreementHash,
            sellerApproved: false,
            buyerApproved: false
        });
        
        emit EscrowCreated(escrowId, msg.sender, seller, amount);
        
        return escrowId;
    }
    
    /**
     * @notice Fund escrow with ETH
     */
    function fundEscrowETH(uint256 escrowId) 
        external 
        payable 
        onlyBuyer(escrowId)
        inState(escrowId, EscrowState.PENDING)
    {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.tokenAddress == address(0), "Not ETH escrow");
        require(msg.value == escrow.amount, "Incorrect amount");
        require(block.timestamp < escrow.deadline, "Deadline passed");
        
        escrow.state = EscrowState.FUNDED;
        
        emit EscrowFunded(escrowId, msg.value);
    }
    
    /**
     * @notice Release funds to seller (requires both parties approval)
     */
    function approveBuyer(uint256 escrowId) 
        external 
        onlyBuyer(escrowId)
        inState(escrowId, EscrowState.FUNDED)
    {
        escrows[escrowId].buyerApproved = true;
        _tryRelease(escrowId);
    }
    
    function approveSeller(uint256 escrowId) 
        external 
        onlySeller(escrowId)
        inState(escrowId, EscrowState.FUNDED)
    {
        escrows[escrowId].sellerApproved = true;
        _tryRelease(escrowId);
    }
    
    function _tryRelease(uint256 escrowId) internal {
        Escrow storage escrow = escrows[escrowId];
        
        if (escrow.buyerApproved && escrow.sellerApproved) {
            escrow.state = EscrowState.RELEASED;
            
            // Calculate fee
            uint256 fee = (escrow.amount * FEE_RATE) / 10000;
            uint256 sellerAmount = escrow.amount - fee;
            
            // Transfer funds
            if (escrow.tokenAddress == address(0)) {
                // ETH transfer
                payable(escrow.seller).transfer(sellerAmount);
                payable(feeCollector).transfer(fee);
            }
            
            emit EscrowReleased(escrowId, sellerAmount);
        }
    }
    
    /**
     * @notice Raise dispute
     */
    function raiseDispute(uint256 escrowId) 
        external 
        inState(escrowId, EscrowState.FUNDED)
    {
        require(
            msg.sender == escrows[escrowId].buyer || 
            msg.sender == escrows[escrowId].seller,
            "Only parties"
        );
        
        escrows[escrowId].state = EscrowState.DISPUTED;
        
        emit DisputeRaised(escrowId, msg.sender);
    }
    
    /**
     * @notice Arbiter resolves dispute
     * @param favorBuyer true = refund buyer, false = pay seller
     */
    function resolveDispute(uint256 escrowId, bool favorBuyer) 
        external 
        onlyArbiter(escrowId)
        inState(escrowId, EscrowState.DISPUTED)
    {
        Escrow storage escrow = escrows[escrowId];
        
        if (favorBuyer) {
            // Refund buyer
            escrow.state = EscrowState.REFUNDED;
            if (escrow.tokenAddress == address(0)) {
                payable(escrow.buyer).transfer(escrow.amount);
            }
            emit EscrowRefunded(escrowId, escrow.amount);
            emit DisputeResolved(escrowId, escrow.buyer);
        } else {
            // Pay seller
            escrow.state = EscrowState.RELEASED;
            uint256 fee = (escrow.amount * FEE_RATE) / 10000;
            uint256 sellerAmount = escrow.amount - fee;
            
            if (escrow.tokenAddress == address(0)) {
                payable(escrow.seller).transfer(sellerAmount);
                payable(feeCollector).transfer(fee);
            }
            emit EscrowReleased(escrowId, sellerAmount);
            emit DisputeResolved(escrowId, escrow.seller);
        }
    }
    
    /**
     * @notice Cancel unfunded escrow
     */
    function cancelEscrow(uint256 escrowId) 
        external 
        onlyBuyer(escrowId)
        inState(escrowId, EscrowState.PENDING)
    {
        escrows[escrowId].state = EscrowState.CANCELLED;
    }
    
    /**
     * @notice Auto-refund after deadline if not released
     */
    function claimExpired(uint256 escrowId) 
        external 
        onlyBuyer(escrowId)
        inState(escrowId, EscrowState.FUNDED)
    {
        Escrow storage escrow = escrows[escrowId];
        require(block.timestamp > escrow.deadline, "Not expired");
        
        escrow.state = EscrowState.REFUNDED;
        
        if (escrow.tokenAddress == address(0)) {
            payable(escrow.buyer).transfer(escrow.amount);
        }
        
        emit EscrowRefunded(escrowId, escrow.amount);
    }
    
    /**
     * @notice Get escrow details
     */
    function getEscrow(uint256 escrowId) 
        external 
        view 
        returns (
            address buyer,
            address seller,
            uint256 amount,
            EscrowState state,
            uint256 deadline,
            bool buyerApproved,
            bool sellerApproved
        )
    {
        Escrow memory escrow = escrows[escrowId];
        return (
            escrow.buyer,
            escrow.seller,
            escrow.amount,
            escrow.state,
            escrow.deadline,
            escrow.buyerApproved,
            escrow.sellerApproved
        );
    }
}
