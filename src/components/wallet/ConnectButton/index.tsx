import { useWallet } from 'contexts/WalletProvider';
import './styles.css';

const ConnectWallet = () => {
  const { address, connectWallet, disconnectWallet } = useWallet();

  const handleConnect = () => {
    if (!address) {
      connectWallet();
    } else {
      disconnectWallet();
    }
  };

  return (
    <button className="button-57" onClick={handleConnect}>
      {!address ? 'Connect Wallet' : 'Disconnect'}
    </button>
  );
};

export default ConnectWallet;
