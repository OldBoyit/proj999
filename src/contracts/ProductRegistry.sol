// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract ProductKeyManager is AccessControl {
    bytes32 public constant PRODUCER_ROLE = keccak256("PRODUCER_ROLE");

    struct ProductDetails {
        string name;
        bytes publicKeyNFC;
        bytes32 secret;
        string manufacturerSignature;
        bytes32 secretHash;
    }

    mapping(bytes32 => ProductDetails) public products;
    mapping(bytes32 => bool) public productExists;
    bytes32[] public productIds;

    event ProductAdded(bytes32 indexed productId, string name, bytes publicKeyNFC, bytes32 secret, string manufacturerSignature, uint256 timestamp);
    event ProductRemoved(bytes32 indexed productId, string name);
    event SecretVerified(bytes32 indexed productId, bool isVerified);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PRODUCER_ROLE, msg.sender);
    }

    function addProduct(
        string memory name,
        bytes memory publicKeyNFC,
        bytes32 secret,
        string memory manufacturerSignature,
        bytes32 secretHash
    ) public onlyRole(PRODUCER_ROLE) {
        // Utilizza publicKeyNFC per creare l'ID del prodotto
        bytes32 productId = keccak256(abi.encodePacked(name, publicKeyNFC, secretHash));
        require(!productExists[productId], "Product already exists.");

        products[productId] = ProductDetails(
            name,
            publicKeyNFC,
            secret,
            manufacturerSignature,
            secretHash
        );
        productExists[productId] = true;
        productIds.push(productId);

        // Aggiorna l'evento con publicKeyNFC
        emit ProductAdded(productId, name, publicKeyNFC, secret, manufacturerSignature, block.timestamp);
    }

    function verifySecret(bytes32 productId, bytes32 secret) public {
        require(productExists[productId], "Product does not exist.");
        bool isVerified = products[productId].secretHash == keccak256(abi.encodePacked(secret));
        emit SecretVerified(productId, isVerified);
    }

    function bytes32ToString(bytes32 _bytes32) private pure returns (string memory) {
        bytes memory bytesArray = new bytes(32);
        for (uint256 i; i < 32; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }

    function addMultipleProducts(ProductDetails[] memory productsToAdd) public onlyRole(PRODUCER_ROLE) {
        for (uint i = 0; i < productsToAdd.length; i++) {
            ProductDetails memory p = productsToAdd[i];
            addProduct(
                p.name,
                p.publicKeyNFC, // Usa il nome aggiornato e assicurati che sia del tipo `bytes`
                p.secret,
                p.manufacturerSignature,
                p.secretHash
            );
        }
    }

    mapping(bytes32 => bool) public isRegistered;

    function registerProductBatch(bytes32[] memory batchProductIds) public onlyRole(PRODUCER_ROLE) {
        for (uint256 i = 0; i < batchProductIds.length; i++) {
            require(productExists[batchProductIds[i]], "Product does not exist.");
            // Example state change:
            isRegistered[batchProductIds[i]] = true;
        }
        // Trigger an event or further processing here if needed
    }
}

