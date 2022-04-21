const Web3 = require("web3");
require("dotenv").config();
const { RINKEBY_URL, ACCOUNT_PRIVATE_KEY } = process.env;

const web3 = new Web3(RINKEBY_URL);

const privateKey = ACCOUNT_PRIVATE_KEY;
const accountAddress = "0xf066F23510645a7DDecC6e5024A57c0f437d4a7E";
const erc721Address = "0x343b904982e5d79c1ceBedc52e0c9A0CA66456c5";

const erc721Abi =
  require("./artifacts/contracts/MyERC721.sol/MyERC721.json").abi;
const contract = new web3.eth.Contract(erc721Abi, erc721Address);

const _mintErcToken = async (fromAddress, contractAddress, data) => {
  try {
    const txObj = {
      from: fromAddress,
      to: contractAddress,
      value: "0x00",
      data: data,
    };
    const gas = await web3.eth.estimateGas(txObj);
    txObj.gas = gas;

    const signedTx = await web3.eth.accounts.signTransaction(txObj, privateKey);
    const tx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    const tokenId = web3.utils.hexToNumberString(tx.logs[0].topics[3]);

    return tokenId;
  } catch (error) {
    console.log(error);
  }
};

const mint = async (fromAddress, contractAddress, tokenURI) => {
  try {
    const data = contract.methods.mint(tokenURI).encodeABI();
    console.log(await _mintErcToken(fromAddress, contractAddress, data));
  } catch (error) {
    console.log(error);
  }
};

mint(accountAddress, erc721Address, "Toi nghich mot ti");
