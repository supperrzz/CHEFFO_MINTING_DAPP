import { React, useState, useEffect } from "react";
import { Connect } from "./connect";
import { MintCard } from "./components/mintCard"
import { FAQ } from "./components/accordion"
import SmartContract from "./assets/Gingerbread_Rockets.json";
import SmartContract2 from "./assets/Milky_Way_Moons.json";
import SmartContract3 from "./assets/Mexican_Wedding_Rock.json";
import SmartContract4 from "./assets/Space_Dust_Ufos.json";
import Web3EthContract from "web3-eth-contract";
import Web3 from "web3";

function App() {
  const [blockchain, setBlockchain] = useState({});
  const [userState, setUserState] = useState('NOT_CONNECTED');
  
  useEffect(() => {
    connect();
  }, []);

  const connect = async () => {
    const { ethereum } = window;
    const metamaskIsInstalled = ethereum && ethereum.isMetaMask;
  
    if (metamaskIsInstalled) {
      Web3EthContract.setProvider(ethereum);
      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const networkId = await ethereum.request({
          method: "net_version",
        });
        
        const { 
          address, 
          network, 
          networkName 
        } = SmartContract

        // If on the correct chain
        if (Number(networkId) === network) {
          setUserState('CONNECTED');

          // Metamask account changes
          ethereum.on("accountsChanged", (accounts) => {
            if (accounts.length > 0)
              setBlockchain(prev => ({
                ...prev,
                account: accounts[0],
              })
              )
            else {
              setUserState('NOT_CONNECTED')
            }
          });

        } else {
          // On the wrong network
          setUserState('WRONG_NETWORK')
        };

          // User changes Metamask chain
          ethereum.on("chainChanged", () => {
            window.location.reload();
          });
        } catch (err) {
          if (err.code === 4001) {
            setUserState('NOT_CONNECTED');
          } else {
            console.log(err)
            setUserState('SYSTEM_ERROR');
          }
        }
    } else {
      setUserState('NOT_CONNECTED');
    }
  };

  const appContent = () => {
    if (userState !== 'CONNECTED') {
      return <Connect userState={userState} connect={connect} />
    } else {
      return (
        <>
          <div class="section hero">
          <img alt="Cookie box" src="https://images.squarespace-cdn.com/content/v1/617ce6e6e7be6e72e51086cc/b926389b-1ea7-4b14-a935-0908171b104f/cookie+box+logo-+2.png?format=2500w"/>
          </div>
          <div id="mint" class="section mint">
            <h2>Select a Cookie</h2>
            <h4>Launch 12/21  |  Quantity 4321 Each  |  5 second Gifs  |  IPFS hosted  |  ERC721  |  2 MATIC Each | Discord = Recipe </h4>
            <div className="grid">
              <MintCard SmartContract={SmartContract} img="https://images.squarespace-cdn.com/content/v1/617ce6e6e7be6e72e51086cc/1639905570476-A61K7SCHIUSPT5K1W7MW/Gingerbread-Rocket.png"/>
              <MintCard SmartContract={SmartContract2} img="https://images.squarespace-cdn.com/content/v1/617ce6e6e7be6e72e51086cc/1639905570950-ODPAHADURHWJFEVE0OZS/Milky-Way-Moons.png"/>
              <MintCard SmartContract={SmartContract3} img="https://images.squarespace-cdn.com/content/v1/617ce6e6e7be6e72e51086cc/1639905572332-GPDY8XN0F5JTQQYDPYWP/Mexican-Wedding-Rock.png"/>
              <MintCard SmartContract={SmartContract4} img="https://images.squarespace-cdn.com/content/v1/617ce6e6e7be6e72e51086cc/1639905572169-EBOGMUMPCCWRVH7P6T7Q/Space-Dust-UFOs.png"/>
            </div>
          </div>
          {/* <div class="section faq">
            <h2>FAQ Section</h2>
            <FAQ />
          </div> */}
        </>
      )
    }
  }


  return (
    <>
      <div class="app">
        <nav class="nav-bar">
          <a href="https://www.cheffo.io">
            <img src="//images.squarespace-cdn.com/content/v1/617ce6e6e7be6e72e51086cc/eba1e465-5a01-4493-8116-a255d434b9fa/CHEFFO+LOGO.png?format=1500w" alt="CHEFFO" class="logo"/>
          </a>
          <ol>
            <li class="link"><a href="/">COOKIE BOX</a></li>
            <li class="link"><a href="https://www.cheffo.io/nft">V1</a></li>
            <li class="link"><a href="https://www.cheffo.io/restaurant">RESTAURANT</a></li>
            <li class="link"><a href="https://www.cheffo.io/cheffo-roadmap">MAP</a></li>
          </ol>
          <a href="#mint" class="link"><span class="btn" >V1 MINT</span></a>
        </nav>
        {appContent()}      
      </div>
      <footer class="footer">
        <img src="//images.squarespace-cdn.com/content/v1/617ce6e6e7be6e72e51086cc/eba1e465-5a01-4493-8116-a255d434b9fa/CHEFFO+LOGO.png?format=1500w" alt="CHEFFO" class="logo"/>
        <h4>Copyright 2021©</h4>
      </footer>
    </>
  );
}

export default App;
