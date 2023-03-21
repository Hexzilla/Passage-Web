import { NetworkType } from '@airgap/beacon-sdk';

export type NetworkConfig = {
  RpcUrl: string;
  Market: string;
  Indexer: string;
  UUSD: string;
  Edition5: string;
  Edition4: string;
};

type ConfigMap = {
  [key in NetworkType]?: NetworkConfig;
};

export const Networks: ConfigMap = {
  [NetworkType.MAINNET]: {
    RpcUrl: 'https://mainnet.api.tez.ie',
    Indexer: "https://api.tzstats.com",
    Market: 'KT1P5Cvfu3TXzxPtowxND6gDfNxrzzkG8oyW', //'KT1V2tXEnb43yxxeb93N8E3ho6kVeTbsmVwC',
    UUSD: 'KT1XRPEPXbZK25r3Htzp2o1x7xdMMmfocKNW',
    Edition5: '',
    Edition4: 'KT1SRFbwhvfkXoRGqiDFVVsf5GTp16wGgtCa',
  },
  [NetworkType.JAKARTANET]: {
    RpcUrl: 'https://jakartanet.tezos.marigold.dev',
    Indexer: "https://api.jakarta.tzstats.com",
    Market: '',
    UUSD: '',
    Edition5: '',
    Edition4: 'KT1SRFbwhvfkXoRGqiDFVVsf5GTp16wGgtCa',
  },
};
