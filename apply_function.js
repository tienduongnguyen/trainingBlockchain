const Web3 = require("web3");
require("dotenv").config();
const { RINKEBY_URL } = process.env;

const web3 = new Web3(RINKEBY_URL);

const privateKey =
  "b76608f0c9407e27c3705cb51ffada391a7eb9b958024a5073e93dd7bec2b78f";

const abi = require("./artifacts/contracts/MyERC721.sol/MyERC721.json").abi;
const contract = new web3.eth.Contract(
  abi,
  "0x6a30CE3f32ed0AD847cAc401548D7e6C8Bec9B50"
);

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

mint(
  "0xf066F23510645a7DDecC6e5024A57c0f437d4a7E",
  "0x6a30CE3f32ed0AD847cAc401548D7e6C8Bec9B50",
  "Toi test xong that roi"
);
