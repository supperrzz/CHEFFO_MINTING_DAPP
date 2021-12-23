export const Connect = ({ userState, setUserState }) => {

  return (
    <div class="connect">
      <div class="section connect">
      <img alt="Cookie box" src="https://images.squarespace-cdn.com/content/v1/617ce6e6e7be6e72e51086cc/b926389b-1ea7-4b14-a935-0908171b104f/cookie+box+logo-+2.png?format=2500w"/>
        <button
          disabled={userState === "WRONG_NETWORK"}
          onClick={(e) => {
            e.preventDefault();
            setUserState("ENTER");
          }}
        >
          [ ENTER THE COOKIE BOX ]
        </button>
        {userState === "WRONG_NETWORK" && <h5>Please switch to the Polygon network</h5>}
      </div>
    </div>
  )
}