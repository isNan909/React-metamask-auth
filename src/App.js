import { useState } from 'react';
import Web3 from 'web3';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [userInfo, setUserInfo] = useState({});

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
        const account = userAccount[0];
        let ethBalance = await web3.eth.getBalance(account); // Get wallet balance
        ethBalance = web3.utils.fromWei(ethBalance, 'ether'); //Convert balance to wei
        saveUserInfo(ethBalance, account, chainId);
        if (userAccount.length === 0) {
          console.log('Please connect to meta mask');
        }
      }
    } catch (err) {
      console.log(
        'There was an error fetching your accounts. Make sure your Ethereum client is configured correctly.'
      );
    }
  };

  const saveUserInfo = (ethBalance, account, chainId) => {
    const userAccount = {
      account: account,
      balance: ethBalance,
      connectionid: chainId,
    };
    window.localStorage.setItem('userAccount', JSON.stringify(userAccount)); //or use a state management lib
    const userData = JSON.parse(localStorage.getItem('userAccount'));
    setUserInfo(userData);
    setIsConnected(true);
  };

  return (
    <div className="App">
      React dApp authentication with Web3.js and Metamask
      <div>
        <button onClick={onConnect}>Connect to MetaMask</button>
      </div>
      {isConnected && <div>You are connected to metamask.{userInfo.account}, {userInfo.balance}, {userInfo.connectionid}</div>}
    </div>
  );
}

export default App;
