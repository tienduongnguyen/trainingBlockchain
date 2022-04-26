const Web3 = require("web3");
require("dotenv").config();
const { RINKEBY_URL, ACCOUNT_PRIVATE_KEY } = process.env;

const web3 = new Web3(RINKEBY_URL);

const privateKey = ACCOUNT_PRIVATE_KEY;
const accountAddress = "0xf066F23510645a7DDecC6e5024A57c0f437d4a7E";
// const erc721Address = "0xe634Ac56643D42B20f2F9752Dca8a4041A250417";
const erc721Address = "0xc7C7b26995c6e5437F9D23dFa333CBCA4E5f90f6";

const erc721Abi =
  require("./artifacts/contracts/MyERC721.sol/MyERC721.json").abi;
const abi = require("./erc721abi.json");
const contractERC721 = new web3.eth.Contract(abi, erc721Address);

const encodeData = (tokenURI, type) => {
  let data = "";
  if (type == "single") {
    data = contractERC721.methods.mint(tokenURI).encodeABI();
  } else if (type == "multiple") {
    data = contractERC721.methods.mintMultiNFT(tokenURI).encodeABI();
  }

  return data;
};

const getTokenId = (logs) => {
  const listTokenId = [];
  for (let i = 0; i < logs.length; i++) {
    const tokenId = web3.utils.hexToNumberString(logs[i].topics[3]);
    listTokenId.push(tokenId);
  }
  return listTokenId;
};

const _mintErcToken = async (fromAddress, contractAddress, tokenURI, type) => {
  try {
    const data = encodeData(tokenURI, type);

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
    const tokenId = getTokenId(tx.logs);
    return tokenId;
  } catch (error) {
    console.log(error);
  }
};

const mint = async (fromAddress, contractAddress, tokenURI) => {
  try {
    console.log(
      await _mintErcToken(fromAddress, contractAddress, tokenURI, "single")
    );
  } catch (error) {
    console.log(error);
  }
};

const mintMultiNFT = async (fromAddress, contractAddress, listTokenURI) => {
  try {
    console.log(
      await _mintErcToken(
        fromAddress,
        contractAddress,
        listTokenURI,
        "multiple"
      )
    );
  } catch (error) {
    console.log(error);
  }
};

// mint(accountAddress, erc721Address, "Something went wrong!!!");

// const listTokenURI = [];
// for (let i = 0; i < 2; i++) {
//   listTokenURI.push(`human ${i}`);
// }
// console.log(listTokenURI.length);

// mintMultiNFT(accountAddress, erc721Address, listTokenURI);

const main = async () => {
  const listTokenURI = [];
  for (let i = 0; i < 200; i++) {
    listTokenURI.push(`human ${i}`);
  }
  console.log(listTokenURI.length);

  const data = contractERC721.methods.mintMultiNFT(listTokenURI).encodeABI();

  const txObj = {
    from: accountAddress,
    to: erc721Address,
    value: "0x00",
    data: data,
  };
  const gas = await web3.eth.estimateGas(txObj);
  console.log(gas * 35);
};

main();

// const getTransaction = () => {};
