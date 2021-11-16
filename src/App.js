import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { injected } from "./components/connector";
import { useWeb3React } from "@web3-react/core";
import { abi } from "./abi/abi.json";

// CONNECT WALLET - ✅
// SHOW ALL THE ASSETS IN A PARTICULAR WALLET

function App() {
  const {
    active,
    account,
    library,
    connector,
    activate,
    deactivate,
    web3context,
  } = useWeb3React();
  let accounts;

  const [balanceAmount, setbalanceAmount] = useState();
  const [name, setName] = useState();

  let web3 = new Web3(
    "https://mainnet.infura.io/v3/60aaba17794f4262a9406f892627ee03"
  );

  let contractAddress = "0xB8c77482e45F1F44dE1745F52C74426C631bDD52";

  // initialize contract

  async function getBalance() {
    try {
      if (account) {
        let contract = new web3.eth.Contract(abi, contractAddress);

        let balance = await contract.methods.balanceOf(account).call();
        setbalanceAmount(balance);
      }

      console.log("BALANCE", balanceAmount);
    } catch (err) {
      console.log(err);
    }
  }

  async function getName() {
    try {
      if (account) {
        let contract = new web3.eth.Contract(abi, contractAddress);
        let name = await contract.methods.name().call();
        let symbol = await contract.methods.symbol().call();
        console.log("SYMBOL", symbol);

        setName(name);
      }

      console.log("BALANCE", balanceAmount);
    } catch (err) {
      console.log(err);
    }
  }

  async function connect() {
    try {
      await activate(injected);
      if (await !ethEnabled()) {
        alert("Please install MetaMask to use this dApp!");
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function disconnect() {
    try {
      await deactivate(injected);
    } catch (err) {
      console.log(err);
    }
  }

  const ethEnabled = async () => {
    if (typeof window.ethereum !== "undefined") {
      // Instance web3 with the provided information from the MetaMask provider information
      web3 = new Web3(window.ethereum);
      try {
        // Request account access
        await window.ethereum.enable();

        return true;
      } catch (e) {
        // User denied access
        return false;
      }
    }

    return false;
  };

  useEffect(() => {
    console.log("web3", Web3);
    console.log("utils", Web3.utils);
    console.log("eth", account);
    getBalance();
    getName();

    // getAllAccounts();
  }, [account]);

  return (
    <div className="App">
      <button onClick={connect}>Connect to MetaMask</button>
      <div>
        {active ? (
          <span>
            connected <b>{account}</b>
          </span>
        ) : (
          <span>Not connected</span>
        )}
      </div>

      <button onClick={disconnect}>Disconnect from MetaMask</button>

      <div>
        <p>
          Balance of {account}: <b>{balanceAmount}</b>
        </p>
        <p style={{ display: "flex", alignItems: "center" }}>
          <img
            src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${Web3.utils.toChecksumAddress(
              contractAddress
            )}/logo.png`}
            alt=""
            width="50px"
            height="50px"
          />
          Name: <b>{name}</b>
        </p>
      </div>
    </div>
  );
}

export default App;
