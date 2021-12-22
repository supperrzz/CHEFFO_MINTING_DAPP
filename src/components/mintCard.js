import React, { useEffect, useState } from "react";
import Web3EthContract from "web3-eth-contract";
import Web3 from "web3";

export const MintCard = ({SmartContract, img}) => {
  const [feedback, setFeedback] = useState(`2 MATIC`);
  const [mintingNft, setMintingNft] = useState(false);
  const [blockchain, setBlockchain] = useState({});
  const [smartContractData, setSmartContractData] = useState({});
  const [mintAmount, setMintAmount] = useState(1);

  useEffect(() => {
    connect();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setSmartContractData({fetching: true});
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
      } catch (err) {
        setSmartContractData({ errorMsg: err.message});
      }
    };
    fetchData();
    setFeedback(`2 MATIC`);
  }, [blockchain]);
  
  const connect = async () => {
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
            // On the wrong network
            setBlockchain({
              errorMsg: `Change network to ${networkName}`
            })
          };
          // User changes Metamask chain
          ethereum.on("chainChanged", () => {
            window.location.reload();
          });
        } catch (err) {
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
    
    const claimNFTs = (mintAmount) => {
      setFeedback(`Minting your ${SmartContract.name}...`);
      setMintingNft(true);
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
      setMintingNft(false);
    })
    .then((receipt) => {
      setFeedback(`Minting complete!`);
      setMintingNft(false);
    });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > smartContractData.maxMintAmount) {
      newMintAmount = smartContractData.maxMintAmount;
    }
    setMintAmount(newMintAmount);
  };

  return (
    <div class="mint-card">
      <h3>{`Amount Minted: ${smartContractData.totalSupply}/${smartContractData.maxSupply}`}</h3>
      <img src={img} alt="Placeholder"/>
      <h3 class="feedback">{feedback}</h3>
      <div class="mint-selector">
        <span
          onClick={(e) => {
            e.preventDefault();
            decrementMintAmount();
          }}
        >
          <h2 class="mint-amount-btn">-</h2>
        </span>
        <button
          onClick={(e) => {
            e.preventDefault();
            claimNFTs(mintAmount);
          }}
        >
         MINT NOW<br/><span class="mint-amount">{`[${mintAmount}]`}</span>
        </button>
        <span
          onClick={(e) => {
            e.preventDefault();
            incrementMintAmount();
          }}
        >
          <h2 class="mint-amount-btn">+</h2>
        </span>
      </div>
      <h4 class="max-mint">{`LIMIT ${smartContractData.maxMintAmount}`}</h4>
    </div>
  )
}