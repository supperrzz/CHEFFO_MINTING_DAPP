import React, { useEffect, useState } from "react";
import Web3EthContract from "web3-eth-contract";
import Web3 from "web3";

export const MintCard = ({SmartContract, img, setUserState, userState}) => {
  const [feedback, setFeedback] = useState(`2 MATIC`);
  const [smartContractData, setSmartContractData] = useState({});
  const [mintAmount, setMintAmount] = useState(1);
  const [connected, setConnected] = useState(false);
  const [loading, setloading] = useState(false);
  const [blockchain, setBlockchain] = useState({});

  useEffect(() => {
    if (blockchain.smartContract !== undefined) {
      fetchData(); 
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [blockchain]);
  
  const fetchData = async () => {
    try {
      let name = await blockchain.smartContract.methods.name()
        .call();
      let maxSupply = await blockchain.smartContract.methods.maxSupply()
        .call();
      let cost = await blockchain.smartContract.methods.cost()
        .call();
      let totalSupply = await blockchain.smartContract.methods.totalSupply()
        .call();
      let maxMintAmount = await blockchain.smartContract.methods.maxMintAmount()
        .call();
      let symbol = await blockchain.smartContract.methods.symbol()
        .call();
      let paused = await blockchain.smartContract.methods.paused()
        .call();
      setSmartContractData({
        name,
        totalSupply,
        cost,
        maxSupply,
        maxMintAmount,
        symbol,
        paused,
      })
      setloading(false)
      setConnected(true)
    } catch (err) {
      setSmartContractData({ errorMsg: err.message});
    }
  };

  const connect = async () => {
    setloading(true)
    const { ethereum } = window;
    const metamaskIsInstalled = ethereum && ethereum.isMetaMask;
    if (metamaskIsInstalled) {
      Web3EthContract.setProvider(ethereum);
      let web3 = new Web3(ethereum);
      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const networkId = await ethereum.request({
          method: "net_version",
        });
        
        const { 
          abi, 
          address, 
          network, 
          networkName 
        } = SmartContract
        
        // If on the correct chain
        if (Number(networkId) === network) {
          const SmartContractObj = new Web3EthContract(
            abi,
            address
          );
 
          // Set blockchain state
          setBlockchain({
            account: accounts[0],
            smartContract: SmartContractObj,
            web3: web3
          })
    
          // Metamask account changes
          ethereum.on("accountsChanged", (accounts) => {
            setFeedback(`2 MATIC`);
            setBlockchain(prev => ({
              ...prev,
              account: accounts[0],
            })
            )
          });
        } else {
          // On the wrong network)
          setUserState("WRONG_NETWORK")
        };
        // User changes Metamask chain
        ethereum.on("chainChanged", () => {
          window.location.reload();
        });
      } catch (err) {
        console.log(err);
        setBlockchain({
          errorMsg: err
        });
      }
    } else {
      setBlockchain({
        errorMsg: "Install Metamask"
      });
    }
  };

  const cardButton = () => {
    if(connected !== true) {
      return (
        <button
          onClick={(e) => {
            e.preventDefault();
            connect();
            fetchData();
          }}
        >
          CONNECT
        </button>
      )
    } else {
      return (
        <div>
          <label>
            <input 
              id="typeinp" 
              type="range" 
              min="1" max={smartContractData.maxMintAmount}
              defaultValue={mintAmount} 
              onChange={(e) => setMintAmount(e.target.value)}
              step="1"/>
            <h3 class="mint-amount">{mintAmount}</h3>
          </label>
          <button
            class="mint-button"
            onClick={(e) => {
              e.preventDefault();
              claimNFTs(mintAmount);
            }}
          >
          MINT NOW
          </button>
        </div>
      )
    }
  }
    
    const claimNFTs = (mintAmount) => {
      setFeedback(`Minting...`);
      blockchain.smartContract.methods
    .mint(mintAmount)
    .send({
      // gasLimit: "285000",
      from: blockchain.account,
      value: blockchain.web3.utils.toWei((smartContractData.cost * mintAmount).toString(), "ether"),
    })
    .once("error", (err) => {
      console.log(err);
      err.code === 4001 ? setFeedback(`2 MATIC`) : setFeedback(`Something went wrong.`);
    })
    .then((receipt) => {
      setFeedback(`Minting complete!`);
    });
  };

  return (
    <div class="mint-card">
      {connected === true && <h3>{`AMOUNT MINTED: ${smartContractData.totalSupply}/${smartContractData.maxSupply}`}</h3>}
      {connected === false && <h3>CONNECT YOUR WALLET</h3>}
      <img src={img} alt="Placeholder"/>
      <h3 class="feedback">{feedback}</h3>
      {cardButton()}
      {loading ? <p class="loading">Loading...</p> : ""}
    </div>
  )
}