import React from 'react';
import { useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import { Alchemy, Network } from "alchemy-sdk";
import {
  useConnect,
  useAccount,
  useFeeData,
  useContractRead,
  useContractWrite,
  useWaitForTransaction
} from 'wagmi';
import contractInterface from '../contract-abi.json';
import { ethers } from 'ethers';
import { isMobile } from 'react-device-detect';
import Modal from '../components/Modal';
import Terms from '../components/Terms';
import Preview from '../components/Preview';
import Faq from '../components/FAQ';
import { Statistic } from 'antd';
const { Countdown } = Statistic;

const contractConfig = {
  addressOrName: '0xD13eCfFE6C2b28ABfa1587496b4FEcc87BFB932C',
  contractInterface: contractInterface,
};

const ensRegistrar = "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85";

const alchemyConfig = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID,
  network: Network.ETH_GOERLI,
};
const alchemy = new Alchemy(alchemyConfig);

const Home: NextPage = () => {
  const { data: accountData } = useAccount();
  const { connectors, isConnected } = useConnect();
  const { data: gasData, isError, isLoading } = useFeeData();

  return (
    <div className="page" style = {{ maxWidth: '100%' }}>
      <div style={{ display: 'none' }}>
      </div>
      <Head>
        <title>CCIP2 - Off-chain Records Manager</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width, user-scalable=no" />
        <link rel="shortcut icon" href="logo-dark.png" />
      </Head>
      {/* Container */}
      <div className="container" style = {{ maxWidth: `inherit` }} >
        {/* Detect Device */}
        {!isMobile && (
          <div style={{ marginLeft: '0px', marginBottom: '15px', marginTop: '15px' }}>
            <ConnectButton label="connect wallet" size="md" />
          </div>
        )}
        {isMobile && (
          <div style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', marginBottom: '15px', marginTop: '15px' }}>
            <ConnectButton label="connect" />
          </div>
        )}
        <br></br>
        {/* Avatar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <img className="avatar" alt="sample" src="logo-dark-alpha.png" width="250" height="250"/>
        </div>
        {/* Content */}
        <div style={{ flex: '1 1 auto' }}>
          <div style={{ marginTop: '0px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
              {!isMobile && (
                <div>
                  <h4 style={{ fontSize: 36, color: 'white' }}>Off-chain Records Manager</h4>
                </div>
              )}
              {isMobile && (
                <div>
                  <h4 style={{ fontSize: 26, color: 'white' }}>Off-chain Records Manager</h4>
                </div>
              )}
            </div>        
          </div>
          <br></br><br></br>
          {/* Footer */}
          <div style={{ marginTop: -10, marginBottom: 20, alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
            <button
              className='button'
              onClick={() => {window.scrollTo(0,0)}}
              style={{ marginRight: 10 }}
              >
              {'faq'}
            </button>
          </div>
          {/* Modals */}
          <div id="modal"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
