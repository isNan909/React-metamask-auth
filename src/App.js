import { useState } from 'react';
import Web3 from 'web3';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [userinfo, setUserinfo] = useState({
    account: '',
    balance: '',
    connctionid: '',
  });

  const detectCurrentProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      // eslint-disable-next-line
      provider = window.web3.currentProvider;
    } else {
      console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
    return provider;
  };

  const onConnect = async () => {
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        if (currentProvider !== window.ethereum) {
          console.log(
            'Non-Ethereum browser detected. You should consider trying MetaMask!'
          );
        }
        await currentProvider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.getAccounts();
        const chainId = await web3.eth.getChainId();
        let ethBalance = await web3.eth.getBalance(userAccount[0]); // Get wallet balance
        ethBalance = web3.utils.fromWei(ethBalance, 'ether'); //Convert balance to wei
        if (userAccount.length === 0) {
          console.log('please connect to meta mask');
        } else if (userAccount[0] !== userinfo.account) {
          setIsConnected(true);
          setUserinfo({
            account: userAccount,
            balance: ethBalance,
            connctionid: chainId,
          });
        }
      }
    } catch (err) {
      console.log(
        'There was an error fetching your accounts. Make sure your Ethereum client is configured correctly.'
      );
    }
  };

  return (
    <div className="App">
      React dApp authentication with Web3.js and Metamask
      <div>
        <button onClick={onConnect}>Connect to MetaMask</button>
      </div>
      {isConnected && (
        <div>
          You are connected to metamask.
          <br />
          Balance: {userinfo.account}
          <br />
          ConnectionID: {userinfo.balance}
          <br />
          Connected Account: {userinfo.connctionid}
        </div>
      )}
    </div>
  );
}

export default App;
