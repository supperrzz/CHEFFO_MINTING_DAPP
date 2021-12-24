import { React, useState } from 'react';

export const Accordion = ({ title, children }) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <div className="accordion-wrapper">
      <div
        className={`accordion-title ${isOpen ? "open" : ""}`}
        onClick={() => setOpen(!isOpen)}
        >
        <h3>{title}</h3>
      </div>
      <div className={`accordion-item ${!isOpen ? "collapsed" : ""}`}>
        <div className="accordion-content">{children}</div>
      </div>
    </div>
  );
};

export const FAQ = () => (
  <div className="wrapper">
    <Accordion title="1. Connect to Polygon">
    <ul>
      <li><p class="">Load Metamask with Ethereum and Matic. </p></li>
      <li><p>Go to <a href="https://wallet.polygon.technology" target="_blank" rel="noreferrer">wallet.polygon.technology</a> to perform a bridge to the Polygon Blockchain. </p></li>
      <li><p>Bridge Matic to the Polygon Blockchain. </p></li>
      <li><p>Go to <a href="https://chainlist.org" target="_blank" rel="noreferrer">Chainlist</a> to load the Polygon Blockchain ID into Metamask. </p></li>
      <li><p>Go back to Metamask and switch to the Polygon Blockchain in the chain drop down menu. </p></li>
      <li><p>Tokens will be visible that were previously on the Polygon Blockchain and bridged tokens will arrive once the transaction has completed.</p></li>
    </ul>
    </Accordion>
    <Accordion title="2. Mint">
      <ul>
        <li><p>Once Matic tokens are available, it is time to put together your Cookie Box. </p></li>
        <li><p>Enter The Cookie Box </p></li>
        <li><p>Select the quantity of each cookie and perform mints for each. </p></li>
        <li><p>Mint a box for frens!!!</p></li>
      </ul>
    </Accordion>
    <Accordion title="3. Tweet = Recipes">
      <ul>
        <li>Tweet at @cheffo_nft with a picture of your NFT card (token ids recorded)</li>
        <li>Receive a DM password to enter that particular Cookie Room.</li>
        <li>Go to cheffo.io and choose which cookie Room to enter</li>
        <li>Click button and enter password</li>
        <li>Enjoy a Recipe PDF for that particular NFT as well as other content will become available, including community gallaries of cookies made.</li>
        <li>Collect all four cards and complete #thecookieboxnft </li>
      </ul>
    </Accordion>
  </div>
)