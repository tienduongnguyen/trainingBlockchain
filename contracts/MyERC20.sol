// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyERC20 is ERC20 {
    constructor() ERC20("SAD BOIZ TOKEN", "SBT") {
        _mint(msg.sender, 1000000000 ether);
    }
}
