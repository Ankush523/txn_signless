import React, { useState } from 'react';
import { ethers } from 'ethers';

const providerUrl ="https://polygon-mumbai.g.alchemy.com/v2/CC-YaEP9wPG0mtb2SlesCoDRUlfhAppE"
const provider = new ethers.providers.JsonRpcProvider(providerUrl);

function TransactionForm() {
  const [privateKey, setPrivateKey] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const sendTransaction = async () => {
    const wallet = new ethers.Wallet(privateKey, provider);
    
    // Fetch the current transaction count (nonce) for the account
    const nonce = await provider.getTransactionCount(wallet.address, 'latest');
  
    const transaction = {
        to: toAddress,
        value: ethers.utils.parseEther(amount),
        chainId: 80001, // This is the chainId for the Polygon Mumbai testnet
        gasPrice: ethers.utils.parseUnits('10', 'gwei'), // Setting the gas price to 10 Gwei
        gasLimit: ethers.utils.hexlify(21000), // Setting a gas limit
        nonce
      };
      
  
    try {
      const signedTransaction = await wallet.signTransaction(transaction);
      const receipt = await provider.sendTransaction(signedTransaction);
      console.log(`Transaction hash: ${receipt.hash}`);
      setMessage(`Transaction successful! Hash: ${receipt.hash}`);
    } catch (err:any) {
      console.error(err);
      setMessage(`Error: ${err.message}`);
    }
  };
  

  return (
    <div>
      <input
        type="text"
        placeholder="Private Key"
        onChange={(e) => setPrivateKey(e.target.value)}
      />
      <input
        type="text"
        placeholder="To Address"
        onChange={(e) => setToAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount in Ether"
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={sendTransaction}>Send Transaction</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default TransactionForm;
