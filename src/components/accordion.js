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
      Load Metamask with Ethereum and Matic. Go to wallet.polygon.technology to
    perform a bridge to Polygon Blockchain. Bridge Ethereum or Matic to the Polygon
    Blockchain. Go to Chainlist to load the Polygon Blockchain ID into Metamask. Go
    back to Metamask and switch to the Polygon Blockchain in the chain drop down
    menu. Tokens will be visible that were previously on the Polygon Blockchain and
    bridged tokens will arrive once the transaction has completed.
    </Accordion>
    <Accordion title="2. Mint">
      Once Matic tokens are available, it is time to put together your Cookie Box. Select
    the quantity of each cookie and perform mints for each. Remember, to enter The
    Cookie Box private Discord room and access to 25% Merchandise, you have to
    hold all four Cookie Box NFTs. Maybe make a box for a friend.
    </Accordion>
    <Accordion title="3. Verify in Discord">
      Collab.land bot will ask you to verify your Metamask Wallet holding the Cookie Box
    NFTs. This will give you access to individual rooms for each cookie. Each Cookie
    Room will contain a link and password to enter a CHEFFO RECIPE PAGE. Recipe
    pages will contain full branded recipes, community shared galleries, full length
    MP4s with enhanced graphics and soundtracks. Enjoy the Discord rooms and
    community.
    </Accordion>
  </div>
)