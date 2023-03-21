import { useCallback, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useWindowSize } from 'hooks/useWindowSize';
import { useWallet } from 'contexts/WalletProvider';
import { useUnityContext } from 'contexts/UnityProvider';
import Unity, { UnityEventListener } from 'components/unity/Unity';
import * as indexer from 'services/indexer';

const unityNotifications = [
  { event: 'StartEvent', message: 'Experience Started' },
  { event: 'ConnectEvent', message: 'Wallet Connected' },
  { event: 'Have1CoinLeftEvent', message: '1 Coin Left' },
  { event: 'Have2CoinsLeftEvent', message: '2 Coins Left' },
  { event: 'Have3CoinsLeftEvent', message: '3 Coins Left' },
  { event: 'Have4PlusCoinsLeftEvent', message: '4 or More Coins Left' },
  { event: 'NoCoinsEvent', message: 'No Coins' },
  { event: 'MintStartedEvent', message: 'Mint Started' },
  { event: 'MintSuccessEvent', message: 'Mint Success' },
  { event: 'MintFailEvent', message: 'Mint Fail' },
  { event: 'MintFailMintedOutEvent', message: 'Mint Fail, Minted Out' },
];

const Play = () => {
  const { address } = useWallet();
  const { unityContext } = useUnityContext();
  const { isLoaded, sendMessage, requestFullscreen } = unityContext;
  const { width } = useWindowSize();

  const isMobile = useMemo(() => width <= 940, [width]);

  useEffect(() => {
    if (address) {
      toast.success('Wallet Connected');
    }
  }, [address]);

  useEffect(() => {
    (async () => {
      if (isLoaded && address) {
        console.log('[Web] Send Wallet Address to Unity', address);
        // Send wallet connected state.
        sendMessage('GFT', 'WalletConnected', address);

        const token = await indexer.getEntryCoin(address);
        const entryCoinAmount = token ? token.value : 0;
        console.log('[Web] Send entryCoinAmount to Unity', entryCoinAmount);
        sendMessage('GFT', 'EntryTokensOnConnect', entryCoinAmount);
      }
    })();
  }, [isLoaded, sendMessage, address]);

  const onSyncWallet = useCallback(() => {
    sendMessage('GFT', 'WalletAddress', address);
  }, [sendMessage, address]);

  const onMint = useCallback(
    async (params) => {
      console.log('Mint', params);
      if (address) {
        const data = JSON.parse(params);
        console.log('Mint-Json', data);
        const items = data.items;
        console.log('Mint-items', items);

        const value = (key) => items.find((i) => i.name === key)?.value ?? 0;

        const payload = {
          artist_choice: value('artist_choice'),
          cave: value('cave'),
          falling_chamber: value('falling_chamber'),
          induction_time: value('induction_time'),
          kairos: value('kairos'),
          manifold: value('manifold'),
          minter: address,
          perception: value('perception'),
          perception_time: value('perception_time'),
        };
        console.log('Mint-Payload', payload);
        const result = await indexer.mint(payload).catch((err) => {
          console.error(err);
          toast.error('Failed to Mint!');
        });
        console.log('Mint-Result', result);

        if (result) {
          sendMessage('GFT', 'MintCompleteWithoutParams');

          const token = await indexer.getEntryCoin(address);
          const entryCoinAmount = token ? token.value : 0;
          sendMessage('GFT', 'MintComplete', entryCoinAmount);

          await indexer.updateEntryCoinAmount(address, entryCoinAmount - 1);
          sendMessage('GFT', 'MintComplete', entryCoinAmount - 1);

          // toast.success('You have minted successfully!');
        }
      }
    },
    [address, sendMessage]
  );

  const onSendNotification = useCallback((event) => {
    const item = unityNotifications.find((i) => i.event === event);
    const message = item ? item.message : '';
    if (!!message) {
      toast(message);
    }
  }, []);

  const eventListeners = useMemo((): UnityEventListener[] => {
    return [
      { eventName: 'onSyncWallet', callback: onSyncWallet },
      { eventName: 'SendMint', callback: onMint },
      { eventName: 'SendNotification', callback: onSendNotification },
    ];
  }, [onSyncWallet, onMint, onSendNotification]);

  const setFullScreen = useCallback(() => {
    isLoaded && requestFullscreen(true);
  }, [isLoaded, requestFullscreen]);

  return (
    <div className="container mx-auto mt-4">
      {isMobile ? (
        <img src="/clown_vamp.png" alt="ClownVamp" />
      ) : (
        <div onClick={setFullScreen}>
          <Unity
            unityContext={unityContext}
            eventListeners={eventListeners}
            styles={{
              height: 540,
              width: 950,
              background: '#555',
            }}
          ></Unity>
        </div>
      )}
    </div>
  );
};

export default Play;
