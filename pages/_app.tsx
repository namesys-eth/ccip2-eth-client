import React from 'react';
import './global.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import {
  RainbowKitProvider,
  getDefaultWallets
} from '@rainbow-me/rainbowkit';
import type {
  Theme
} from '@rainbow-me/rainbowkit';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { isMobile } from 'react-device-detect';

let rainbowFont = '';
if (isMobile) {
  rainbowFont = 'Spotnik';
} else {
  rainbowFont = 'Spotnik';
}

const customTheme: Theme = {
  blurs: {
    modalOverlay: '',
  },
  colors: {
    accentColor: 'linear-gradient(112deg, rgba(190,95,65,1) 0%, rgba(191,41,36,1) 48%, rgba(203,111,0,1) 100%)',
    accentColorForeground: 'white',
    actionButtonBorder: 'white',
    actionButtonBorderMobile: 'white',
    actionButtonSecondaryBackground: 'linear-gradient(112deg, rgba(198,127,105,1) 0%, rgba(230,136,133,1) 48%, rgba(254,232,206,1) 100%)',
    closeButton: 'black',
    closeButtonBackground: 'linear-gradient(112deg, rgba(198,127,105,1) 0%, rgba(218,85,81,1) 48%, rgba(212,160,99,1) 100%)',
    connectButtonBackground: 'linear-gradient(112deg, rgba(190,95,65,1) 0%, rgba(191,41,36,1) 48%, rgba(203,111,0,1) 100%)',
    connectButtonBackgroundError: 'red',
    connectButtonInnerBackground: 'linear-gradient(153deg, rgba(190,95,65,1) 0%, rgba(152,33,30,1) 48%, rgba(203,111,0,1) 100%)',
    connectButtonText: 'white',
    connectButtonTextError: 'red',
    connectionIndicator: 'white',
    error: 'red',
    generalBorder: 'rgb(255, 255, 255, 0.75)',
    generalBorderDim: 'rgb(255, 255, 255, 0.25)',
    menuItemBackground: 'linear-gradient(112deg, rgba(190,95,65,1) 0%, rgba(191,41,36,1) 48%, rgba(203,111,0,1) 100%)',
    modalBackdrop: 'none',
    modalBackground: 'linear-gradient(90deg, rgba(36,28,57,0.985) 0%, rgba(114,137,149,0.985) 100%)',
    modalBorder: 'white',
    modalText: 'white',
    modalTextDim: 'rgb(255, 255, 255, 0.825)',
    modalTextSecondary: 'rgb(255, 255, 255, 0.825)',
    profileAction: 'rgb(0, 0, 0, 0.5)',
    profileActionHover: 'linear-gradient(112deg, rgba(190,95,65,1) 0%, rgba(191,41,36,1) 48%, rgba(203,111,0,1) 100%)',
    profileForeground: 'rgb(0, 0, 0, 0.5)',
    selectedOptionBorder: 'white',
    standby: 'white',
  },
  fonts: {
    body: `${rainbowFont}`,
  },
  radii: {
    actionButton: '6px',
    connectButton: '6px',
    menuButton: '6px',
    modal: '6px',
    modalMobile: '6px',
  },
  shadows: {
    connectButton: '',
    dialog: '',
    profileDetailsAction: '',
    selectedOption: '',
    selectedWallet: '',
    walletLogo: '',
  }
};

const { chains, provider } = configureChains(
  [
    chain.goerli
  ],
  [
    alchemyProvider({ alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'CCIP2.eth',
  chains,
});

const appInfo = {
  appName: 'CCIP2.eth: Off-chain ENS Records Manager',
};

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          appInfo={appInfo}
          chains={chains}
          theme={customTheme}
        >
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}

export default MyApp;
