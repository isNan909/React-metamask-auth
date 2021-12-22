import { useState, useEffect } from 'react';
import Web3 from 'web3';

import MetamaskLogo from './assets/metamask.svg';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    function checkConnectedWallet() {
      const userData = JSON.parse(localStorage.getItem('userAccount'));
      if (userData != null) {
        setUserInfo(userData);
        setIsConnected(true);
      }
    }
    checkConnectedWallet();
  }, []);

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

  const onDisconnect = () => {
    window.localStorage.removeItem('userAccount');
    setUserInfo({});
    setIsConnected(false);
  };

  const saveUserInfo = (ethBalance, account, chainId) => {
    const userAccount = {
      account: account,
      balance: ethBalance,
      connectionid: chainId,
    };
    window.localStorage.setItem('userAccount', JSON.stringify(userAccount)); //user persisted data
    const userData = JSON.parse(localStorage.getItem('userAccount'));
    setUserInfo(userData);
    setIsConnected(true);
  };

  return (
    <div className="app">
      <div className="app-header">
        <h1>React dApp authentication with Web3.js and Metamask</h1>
      </div>
      <div className="app-wrapper">
        {!isConnected && (
          <div>
            <img src={MetamaskLogo} alt="meta mask logo" />
            <button className="app-buttons__login" onClick={onConnect}>
              Connect to MetaMask
            </button>
          </div>
        )}
      </div>
      {isConnected && (
        <div className="app-wrapper">
          <div className="app-details">
            <h2>✅ You are connected to metamask.</h2>
            <div className="app-account">
              <span>Account number:</span>
              {userInfo.account}
            </div>
            <div className="app-balance">
              <span>Balance:</span>
              {userInfo.balance}
            </div>
            <div className="app-connectionid">
              <span>Connection ID:</span>
              {userInfo.connectionid}
            </div>
          </div>
          <div>
            <button className="app-buttons__logout" onClick={onDisconnect}>
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
