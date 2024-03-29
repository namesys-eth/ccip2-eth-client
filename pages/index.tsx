/// Homepage
import React from "react";
import Head from "next/head";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import { useAccount, useContractRead } from "wagmi";
import { ethers } from "ethers";
import { isMobile } from "react-device-detect";
import Help from "../components/Help";
import Terms from "../components/Terms";
import Preview from "../components/Preview";
import Stealth from "../components/Stealth";
import Faq from "../components/FAQ";
import Error from "../components/Error";
import List from "../components/List";
import GasTicker from "../components/Ticker";
import Loading from "../components/Loading";
import { BigSearch } from "../components/Search";
import * as C from "../utils/constants";
import * as verifier from "../utils/verifier";
import * as ensContent from "../utils/contenthash";

/// Homepage
const Home: NextPage = () => {
  const {
    address: _Wallet_,
    isConnected: isConnected,
    isDisconnected: isDisconnected,
  } = useAccount();
  const [meta, setMeta] = React.useState<any[]>([]); // Stores all names and their states
  const [faqModal, setFaqModal] = React.useState(false); // Controls FAQ modal
  const [helpModal, setHelpModal] = React.useState(false);
  const [termsModal, setTermsModal] = React.useState(false); // Controls Terms modal
  const [errorModal, setErrorModal] = React.useState(false); // Controls Error modal
  const [errorMessage, setErrorMessage] = React.useState(""); // Sets Error message
  const [previewModal, setPreviewModal] = React.useState(false); // Controls Preview modal
  const [stealthModal, setStealthModal] = React.useState(false); // Controls Stealth modal
  const [nameToPreview, setNameToPreview] = React.useState(""); // Sets name to expand in preview
  const [nameToStealth, setNameToStealth] = React.useState(""); // Sets name to expand in stealth
  const [loading, setLoading] = React.useState(true); // Tracks if a process is occuring
  const [empty, setEmpty] = React.useState(false); // Tracks if wallet has no NFTs
  const [success, setSuccess] = React.useState(false); // Tracks success of process(es)
  const [finish, setFinish] = React.useState(false); // Finish query
  const [tokenIDLegacy, setTokenIDLegacy] = React.useState(""); // Set Token ID of unwrapped/legacy name
  const [namehashLegacy, setNamehashLegacy] = React.useState(""); // Legacy Namehash of ENS Domain
  const [tokenIDWrapper, setTokenIDWrapper] = React.useState(""); // Set Token ID of wrapped name
  const [manager, setManager] = React.useState(""); // Set manager of name
  const [query, setQuery] = React.useState(""); // Store name in query
  const [savings, setSavings] = React.useState(""); // Save gas savings
  const [icon, setIcon] = React.useState(""); // Set Icon inside help modal
  const [color, setColor] = React.useState("white"); // Set Color of help modal
  const [help, setHelp] = React.useState(""); // Set Help modal
  const [searchType, setSearchType] = React.useState(""); // Type of search by query
  const [recordhash, setRecordhash] = React.useState(""); // Recordhash
  const [ownerhash, setOwnerhash] = React.useState(""); // Ownerhash
  const [owner, setOwner] = React.useState(""); // Owner of ENS domain
  const [onSearch, setOnSearch] = React.useState(false); // Stores search trigger
  const [backend, setBackend] = React.useState(true); // Sets backend status
  const [top, setTop] = React.useState(""); // Top margin for Help modal
  const [previewModalState, setPreviewModalState] =
    React.useState<C.CustomBodyState>({
      modalData: "",
      trigger: false,
    }); // Preview modal state
  const [stealthModalState, setStealthModalState] =
    React.useState<C.CustomBodyState>({
      modalData: "",
      trigger: false,
    }); // Stealth modal state

  // Handle Preview modal data return
  const handlePreviewModalData = (data: string) => {
    setPreviewModalState((prevState) => ({ ...prevState, modalData: data }));
  };
  // Handle Preview modal trigger return
  const handlePreviewTrigger = (trigger: boolean) => {
    setPreviewModalState((prevState) => ({ ...prevState, trigger: trigger }));
  };
  // Handle Stealth modal data return
  const handleStealthModalData = (data: string) => {
    setStealthModalState((prevState) => ({ ...prevState, modalData: data }));
  };
  // Handle Stealth modal trigger return
  const handleStealthTrigger = (trigger: boolean) => {
    setStealthModalState((prevState) => ({ ...prevState, trigger: trigger }));
  };

  const isProduction = process.env.NEXT_PUBLIC_ENV === "production";
  const _Chain_ = process.env.NEXT_PUBLIC_NETWORK === "mainnet" ? "1" : "5";
  const ccip2Contract = C.ccip2[_Chain_ === "1" ? 1 : 0];
  const ccip2Config = C.ccip2Config[_Chain_ === "1" ? 1 : 0];
  const PORT = process.env.NEXT_PUBLIC_PORT;
  const SERVER = process.env.NEXT_PUBLIC_SERVER;

  // Get in-app account allowed to manage/edit NameSys records
  async function getRecordEditor(provider: any) {
    let _OwnerLegacy: string = "";
    let _ManagerLegacy: string = "";
    const contractLegacyRegistry = new ethers.Contract(
      C.ensConfig[0].addressOrName,
      C.ensConfig[0].contractInterface,
      provider
    );
    try {
      _ManagerLegacy = await contractLegacyRegistry.owner(namehashLegacy);
    } catch (error) {}
    const contractLegacyRegistrar = new ethers.Contract(
      C.ensConfig[1].addressOrName,
      C.ensConfig[1].contractInterface,
      provider
    );
    try {
      _OwnerLegacy = await contractLegacyRegistrar.ownerOf(tokenIDLegacy);
    } catch (error) {}
    const contractWrapper = new ethers.Contract(
      C.ensConfig[_Chain_ === "1" ? 7 : 3].addressOrName,
      C.ensConfig[_Chain_ === "1" ? 7 : 3].contractInterface,
      provider
    );
    let _OwnerWrapped: string = "";
    try {
      _OwnerWrapped = await contractWrapper.ownerOf(tokenIDWrapper);
    } catch (error) {}
    if (_OwnerLegacy === C.zeroAddress) {
      return C.zeroAddress;
    }
    if (_OwnerLegacy === C.ensContracts[_Chain_ === "1" ? 7 : 3]) {
      if (_OwnerWrapped !== C.zeroAddress) {
        return _OwnerWrapped;
      } else {
        return C.zeroAddress;
      }
    }
    return _ManagerLegacy;
  }

  // Get Recordhash with ethers.js
  async function getRecordhash(provider: any, name: string) {
    const contract = new ethers.Contract(
      ccip2Config.addressOrName,
      ccip2Config.contractInterface,
      provider
    );
    let _recordhash: string = "";
    try {
      _recordhash = await contract.getRecordhash(ethers.utils.namehash(name));
    } catch (error) {
      console.error("Error in getRecordhash():", error);
    }
    if (_recordhash === null) {
      return "";
    }
    return _recordhash;
  }

  // Get Ownerhash
  async function getOwnerhash(provider: any, address: string) {
    const contract = new ethers.Contract(
      ccip2Config.addressOrName,
      ccip2Config.contractInterface,
      provider
    );
    let _ownerhash: string = "";
    try {
      _ownerhash = await contract.getRecordhash(
        ethers.utils.hexZeroPad(address, 32).toLowerCase()
      );
    } catch (error) {
      console.error("Error in getRecordhash():", error);
    }
    if (_ownerhash === null) {
      return "";
    }
    return _ownerhash;
  }

  // Get historical gas savings
  async function getSavings() {
    const request = {
      type: "gas",
    };
    try {
      const _RESPONSE = await fetch(`${SERVER}:${PORT}/gas`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
      const data = await _RESPONSE.json();
      setBackend(true);
      return data.response.gas;
    } catch (error) {
      console.error("Error:", "Failed to get gas data from NameSys backend");
      setErrorMessage("Backend Service is Offline");
      setErrorModal(true);
      setBackend(false);
      return "";
    }
  }

  // Load historical gas savings on pageload
  React.useEffect(() => {
    setOwner("");
    setOwnerhash("");
    setRecordhash("");
    C.showOverlay(5);
    const getSaving = async () => {
      const _savings = await getSavings();
      setSavings(_savings);
    };
    getSaving();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle migration from Preview modal
  React.useEffect(() => {
    if (previewModalState.trigger && previewModalState.modalData) {
      // Trigger update when one of the names is migrated
      let _LIST = meta;
      const index = _LIST.findIndex(
        (item) =>
          `${item.name}.eth` === previewModalState.modalData.slice(0, -1)
      );
      const _update = async () => {
        if (previewModalState.modalData) {
          const _Resolver = await C.provider.getResolver(
            previewModalState.modalData.slice(0, -1)
          ); // Get updated Resolver
          const __Recordhash = await verifier.verifyRecordhash(
            previewModalState.modalData.slice(0, -1),
            ccip2Config,
            _Wallet_ || C.zeroAddress
          ); // Get updated Recordhash
          const __Ownerhash = await verifier.verifyOwnerhash(
            ccip2Config,
            _Wallet_ || C.zeroAddress
          ); // Get updated Ownerhash
          _LIST[index].migrated =
            _Resolver?.address === ccip2Contract && __Recordhash !== "0"
              ? __Recordhash === "1"
                ? "1"
                : "4/5"
              : _Resolver?.address === ccip2Contract && __Ownerhash !== "0"
              ? __Ownerhash === "1"
                ? "3/4"
                : "4/5"
              : _Resolver?.address === ccip2Contract
              ? "1/2"
              : "0"; // Set new flag
        }
      };
      _update();
      setMeta(_LIST);
      setPreviewModal(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewModalState]);

  // Preview modal state
  React.useEffect(() => {
    if (
      previewModalState.trigger &&
      previewModalState.modalData &&
      !previewModal
    ) {
      if (
        previewModalState.modalData.charAt(
          previewModalState.modalData.length - 1
        ) === "#"
      ) {
        setNameToPreview(`${previewModalState.modalData.slice(0, -1)}#`);
      } else if (
        previewModalState.modalData.charAt(
          previewModalState.modalData.length - 1
        ) === "-"
      ) {
        setNameToPreview(`${previewModalState.modalData.slice(0, -1)}-`);
      } else if (
        previewModalState.modalData.charAt(
          previewModalState.modalData.length - 1
        ) === "&"
      ) {
        setNameToPreview(`${previewModalState.modalData.slice(0, -1)}&`);
      } else if (
        previewModalState.modalData.charAt(
          previewModalState.modalData.length - 1
        ) === "+"
      ) {
        setNameToPreview(`${previewModalState.modalData.slice(0, -1)}+`);
      }
      setPreviewModalState({
        modalData: "",
        trigger: false,
      });
    }
  }, [previewModal, previewModalState]);

  // Stealth modal state
  React.useEffect(() => {
    if (
      stealthModalState.trigger &&
      stealthModalState.modalData &&
      !stealthModal
    ) {
      setNameToStealth("");
      setStealthModalState({
        modalData: "",
        trigger: false,
      });
    }
  }, [stealthModal, stealthModalState]);

  // Trigger Preview modal
  React.useEffect(() => {
    if (
      nameToPreview.endsWith(":") ||
      nameToPreview.endsWith("#") ||
      nameToPreview.endsWith("-") ||
      nameToPreview.endsWith("&")
    ) {
      setPreviewModal(true);
    } else {
      setPreviewModal(false);
    }
  }, [nameToPreview]);

  // Trigger Stealth modal
  React.useEffect(() => {
    if (nameToStealth.endsWith(".eth")) {
      setStealthModal(true);
    } else {
      setStealthModal(false);
    }
  }, [nameToStealth]);

  // Preserve metadata across pageloads
  React.useEffect(() => {
    const handleBeforeUnload = () => {};
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [meta]);

  // Open Preview modal for chosen ENS domain
  const onItemClickPreview = (name: string) => {
    setNameToPreview(`${name}:`);
  };

  // Open Stealth modal for chosen ENS domain
  const onItemClickStealth = (name: string) => {
    setNameToStealth(`${name}`);
  };

  /// ENS Domain Search Functionality
  // Read ENS Legacy Registrar for Owner record of ENS domain via namehash
  const {
    data: _OwnerLegacy_,
    isLoading: legacyOwnerLoading,
    isError: legacyOwnerError,
  } = useContractRead({
    address: `0x${C.ensConfig[1].addressOrName.slice(2)}`,
    abi: C.ensConfig[1].contractInterface,
    functionName: "ownerOf",
    args: [tokenIDLegacy],
  });

  // Read ENS Wrapper for Owner record of ENS domain
  const {
    data: _OwnerWrapped_,
    isLoading: wrapperOwnerLoading,
    isError: wrapperOwnerError,
  } = useContractRead({
    address: `0x${C.ensConfig[_Chain_ === "1" ? 7 : 3].addressOrName.slice(2)}`,
    abi: C.ensConfig[_Chain_ === "1" ? 7 : 3].contractInterface,
    functionName: "ownerOf",
    args: [tokenIDWrapper],
  });

  // Read Legacy ENS Registry for ENS domain Manager
  const {
    data: _ManagerLegacy_,
    isLoading: legacyManagerLoading,
    isError: legacyManagerError,
  } = useContractRead({
    address: `0x${C.ensConfig[0].addressOrName.slice(2)}`,
    abi: C.ensConfig[0].contractInterface,
    functionName: "owner",
    args: [namehashLegacy],
  });

  // Read Recordhash from CCIP2 Resolver
  const {
    data: _Recordhash_,
    isLoading: recordhashLoading,
    isError: recordhashError,
  } = useContractRead({
    address: `0x${ccip2Config.addressOrName.slice(2)}`,
    abi: ccip2Config.contractInterface,
    functionName: "getRecordhash",
    args: [ethers.utils.namehash(query)],
  });

  // Read Ownerhash from CCIP2 Resolver
  const {
    data: _Ownerhash_,
    isLoading: ownerhashLoading,
    isError: ownerhashError,
  } = useContractRead({
    address: `0x${ccip2Config.addressOrName.slice(2)}`,
    abi: ccip2Config.contractInterface,
    functionName: "getRecordhash",
    args: [
      ethers.utils.hexZeroPad(_Wallet_ || C.zeroAddress, 32).toLowerCase(),
    ],
  });

  // Set in-app manager for the ENS domain
  React.useEffect(() => {
    if (
      _OwnerWrapped_ &&
      _ManagerLegacy_ &&
      String(_OwnerWrapped_) !== C.zeroAddress &&
      String(_ManagerLegacy_) !== C.zeroAddress
    ) {
      if (String(_ManagerLegacy_) === C.ensContracts[_Chain_ === "1" ? 7 : 3]) {
        if (_OwnerWrapped_ && String(_OwnerWrapped_) !== C.zeroAddress) {
          setManager(String(_OwnerWrapped_));
          setOwner(String(_OwnerWrapped_));
        }
      } else {
        setManager(String(_OwnerLegacy_));
        setOwner(String(_OwnerLegacy_));
      }
    } else {
      if (_OwnerLegacy_ && String(_OwnerLegacy_) !== C.zeroAddress) {
        setOwner(String(_OwnerLegacy_));
        setManager(String(_OwnerLegacy_));
      } else {
        if (_ManagerLegacy_ && String(_ManagerLegacy_) !== C.zeroAddress) {
          setManager(String(_ManagerLegacy_));
        } else {
          setManager(C.zeroAddress);
        }
        setOwner(C.zeroAddress);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tokenIDLegacy,
    _OwnerLegacy_,
    tokenIDWrapper,
    _OwnerWrapped_,
    _ManagerLegacy_,
  ]);

  // Get data from Ethers.JS if wallet is not connected
  React.useEffect(() => {
    if (!_Wallet_ && tokenIDLegacy && tokenIDWrapper && query && query !== "") {
      const _setOrigins = async () => {
        let _Owner = await getRecordEditor(C.provider);
        let _Recordhash = await getRecordhash(C.provider, query);
        let _Ownerhash = await getOwnerhash(C.provider, _Owner);
        if (_Owner) {
          setOwner(_Owner);
          if (_Recordhash && _Ownerhash && _Recordhash !== _Ownerhash) {
            if (String(_Recordhash).startsWith(C.httpPrefix)) {
              setRecordhash(ethers.utils.toUtf8String(String(_Recordhash)));
            } else {
              setRecordhash(
                `ipns://${
                  ensContent.decodeContenthash(String(_Recordhash)).decoded
                }`
              );
            }
            setOwnerhash(_Ownerhash);
          } else if (_Recordhash && _Ownerhash && _Recordhash === _Ownerhash) {
            setRecordhash("");
            if (String(_Ownerhash).startsWith(C.httpPrefix)) {
              setOwnerhash(ethers.utils.toUtf8String(String(_Ownerhash)));
            } else {
              setOwnerhash(
                `ipns://${
                  ensContent.decodeContenthash(String(_Ownerhash)).decoded
                }`
              );
            }
          } else if (_Recordhash && !_Ownerhash) {
            if (String(_Recordhash).startsWith(C.httpPrefix)) {
              setRecordhash(ethers.utils.toUtf8String(String(_Recordhash)));
            } else {
              setRecordhash(
                `ipns://${
                  ensContent.decodeContenthash(String(_Recordhash)).decoded
                }`
              );
            }
            setOwnerhash("");
          } else {
            setRecordhash("");
            setOwnerhash("");
          }
        } else {
          setOwner("0x");
          setSuccess(false);
        }
      };
      _setOrigins();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, tokenIDLegacy, tokenIDWrapper]);

  // Shows search result for ENS domain search
  React.useEffect(() => {
    if (query.length > 0) {
      var allEns: string[] = [];
      var items: any[] = [];
      allEns.push(query.split(".eth")[0]);
      const setMetadata = async () => {
        C.provider.getResolver(query).then((_RESPONSE) => {
          items.push({
            key: 1, // Redundant [?]
            name: query.split(".eth")[0],
            migrated: _RESPONSE?.address === ccip2Contract ? "1/2" : "0",
          });
          if (items.length > 0) {
            if (
              recordhash &&
              String(recordhash) !== "ipns://" &&
              items[0].migrated === "1/2"
            ) {
              items[0].migrated = String(recordhash).startsWith("https://")
                ? "4/5"
                : "1";
            } else if (
              ownerhash &&
              String(ownerhash) !== "ipns://" &&
              items[0].migrated === "1/2"
            ) {
              items[0].migrated = String(ownerhash).startsWith("https://")
                ? "4/5"
                : "3/4";
            }
            setMeta(items);
            setSuccess(true);
            setFinish(true);
          }
        });
      };
      setMetadata();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, recordhash, ownerhash]);

  // Captures Recordhash hook
  React.useEffect(() => {
    if (_Recordhash_ && _Recordhash_ !== _Ownerhash_ && _Wallet_) {
      if (String(_Recordhash_).startsWith(C.httpPrefix)) {
        setRecordhash(ethers.utils.toUtf8String(String(_Recordhash_)));
      } else {
        setRecordhash(
          `ipns://${ensContent.decodeContenthash(String(_Recordhash_)).decoded}`
        );
      }
    } else {
      setRecordhash("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_Recordhash_, _Ownerhash_]);

  // Captures Ownerhash hook
  React.useEffect(() => {
    if (_Ownerhash_ && _Wallet_) {
      if (String(_Ownerhash_).startsWith(C.httpPrefix)) {
        setOwnerhash(ethers.utils.toUtf8String(String(_Ownerhash_)));
      } else {
        setOwnerhash(
          `ipns://${ensContent.decodeContenthash(String(_Ownerhash_)).decoded}`
        );
      }
    } else {
      setOwnerhash("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_Ownerhash_]);

  // End name query
  React.useEffect(() => {
    if (success && finish) {
      if (owner !== "0x" && owner !== C.zeroAddress) {
        setErrorModal(false);
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 5000);
        setEmpty(false);
      } else {
        if (legacyOwnerError) {
          setTimeout(() => {
            setLoading(false);
          }, 2000);
          setErrorMessage("Name not Registered Or Expired Or in Grace");
          setErrorModal(true);
          setEmpty(true);
          setQuery("");
        } else {
          setTimeout(() => {
            setLoading(false);
          }, 2000);
          setErrorMessage("Name not Registered Or Expired Or in Grace");
          setErrorModal(true);
          setEmpty(true);
          setQuery("");
        }
      }
    } else {
      if (finish) {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
        setErrorMessage("Name not Registered Or Expired Or in Grace");
        setErrorModal(true);
        setEmpty(true);
      } else {
        setLoading(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, owner, finish]);

  // Sets tokenID for ENS domain search result
  React.useEffect(() => {
    if (query) {
      try {
        let __namehash = ethers.utils.namehash(query);
        let __token = ethers.BigNumber.from(__namehash);
        setTokenIDWrapper(String(__token));
        // BROWSER
        let __labelhash = C.calculateLabelhash(query);
        setNamehashLegacy(__namehash);
        setTokenIDLegacy(String(ethers.BigNumber.from(__labelhash)));
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, owner, manager]);

  // Triggers search of ENS domain
  const handleNameSearch = (query: string) => {
    setLoading(true);
    setQuery(query);
    setMeta([]);
    setTokenIDLegacy("");
    setTokenIDWrapper("");
    setManager("");
    setSearchType("search");
    setRecordhash("");
    setOwner("");
    setOnSearch(true);
    if (_Wallet_) {
    } else {
      setOwnerhash("");
    }
  };

  /// index.tsx
  return (
    <div
      className="page flex-column-sans-align"
      style={{
        maxWidth: "100vw",
      }}
    >
      {/* Avatar */}
      {!isMobile && (
        <div
          style={{
            margin: "20px",
            width: "40%",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <img className="avatar" alt="corner-index" src="logo.png" />
        </div>
      )}
      <Head>
        <title>NameSys - Off-Chain Records Manager</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="NameSys" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="logo.png" />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          as="style"
        />
        <link
          rel="preload"
          href="SF-Mono.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="Spotnik.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="Rajdhani.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </Head>
      {/* Preload */}
      <div style={{ fontFamily: "Rajdhani" }}></div>
      <div style={{ fontFamily: "SF Mono" }}></div>
      <div style={{ fontFamily: "Spotnik" }}></div>
      {/* Overlay */}
      <div id="overlay" className="overlay">
        <div className="overlay-content">
          <Loading height={isMobile ? 50 : 75} width={isMobile ? 50 : 75} />
          <div
            style={{
              marginTop: "20px",
            }}
          >
            <span>PLEASE WAIT</span>
          </div>
        </div>
      </div>
      {/* Buttons */}
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: !isMobile ? "row" : "column",
              marginLeft: !isMobile ? "9%" : "25px",
              marginRight: "auto",
              marginTop: !isMobile ? "-7%" : "25px",
            }}
          >
            <div
              style={{
                marginRight: !isMobile ? "40px" : "20px",
              }}
            >
              <button
                className="button"
                onClick={() => {
                  window.location.href = isProduction
                    ? "/account.html"
                    : "/account";
                }}
                data-tooltip="My Names"
                disabled={isDisconnected || !backend}
                hidden={isMobile}
              >
                <div className="flex-sans-direction">
                  {!isMobile ? "My Names" : "Names"}&nbsp;
                  <span className="material-icons">admin_panel_settings</span>
                </div>
              </button>
            </div>
            <div
              style={{
                marginLeft: !isMobile ? "-30px" : "-20px",
                marginTop: !isMobile ? "0px" : "-25px",
              }}
            >
              <GasTicker variable={savings} mobile={isMobile} />
            </div>
          </div>
          <div
            className="connect-button"
            style={{
              marginLeft: "auto",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              marginTop: !isMobile ? "-7%" : "-5px",
            }}
          >
            <div
              style={{
                marginRight: !isMobile ? "15px" : "10px",
                marginTop: !isMobile ? "6px" : "10px",
                color: "#ff2600",
                fontFamily: "SF Mono",
                fontSize: !isMobile ? "18px" : "13px",
              }}
            >
              <span
                style={{
                  fontFamily: "Spotnik",
                  fontSize: !isMobile ? "12px" : "7.5px",
                  fontWeight: "700",
                  marginRight: "2px",
                }}
              >
                {"v"}
              </span>
              {"1.3"}
              <span
                style={{
                  fontFamily: "Spotnik",
                  fontSize: !isMobile ? "15px" : "10px",
                  fontWeight: "700",
                  marginLeft: "2px",
                }}
              >
                {""}
              </span>
            </div>
            <button
              className="button clear"
              onClick={() => {
                window.scrollTo(0, 0);
                setFaqModal(true);
              }}
              style={{ marginRight: 10, display: "none" }}
              data-tooltip="Learn more"
            >
              <div className="flex-row">
                {"about"}
                <span style={{ fontFamily: "SF Mono" }}>&nbsp;</span>
                <span className="material-icons">info</span>
              </div>
            </button>
            <button
              className="button clear"
              onClick={() => {
                window.scrollTo(0, 0);
                setTermsModal(true);
              }}
              style={{ marginRight: 10, display: "none" }}
              data-tooltip="Terms of Use"
            >
              <div className="flex-row">
                {"terms"}&nbsp;<span className="material-icons">gavel</span>
              </div>
            </button>
            {!isMobile && (
              <div>
                <ConnectButton label="connect" />
              </div>
            )}
            {isMobile && (
              <div>
                <ConnectButton label="connect" />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Container */}
      <div
        className="container"
        style={{
          maxWidth: `inherit`,
          marginTop: onSearch ? "0px" : "40px",
        }}
      >
        {/* Content */}
        <div
          className={
            !isMobile && !onSearch
              ? "heading"
              : !isMobile && onSearch
              ? "heading"
              : "none"
          }
          style={{
            flex: "1 1 auto",
          }}
        >
          <div style={{ marginTop: "-120px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
                paddingTop: "100px",
              }}
            >
              {!isMobile && (
                <div>
                  <div
                    className="flex-column"
                    style={{
                      fontSize: onSearch ? "46px" : "50px",
                      marginTop: onSearch ? "20px" : "28px",
                      color: "#ff2600",
                      marginBottom: "10px",
                      fontWeight: "700",
                    }}
                  >
                    NameSys
                  </div>
                  <div
                    className="flex-column"
                    style={{
                      fontSize: onSearch ? "24px" : "28px",
                      marginTop: "0px",
                      color: "#fc4e14",
                      fontWeight: "700",
                    }}
                  >
                    Advanced
                  </div>
                </div>
              )}
              {isMobile && (
                <div>
                  <img
                    className={onSearch ? "icon-ccip2-mobile" : "icon-ccip2"}
                    alt="sample-icon"
                    src="logo.png"
                  />
                  <div
                    className="flex-column"
                    style={{
                      fontSize: onSearch ? "36px" : "44px",
                      marginTop: "10px",
                      color: "#ff2600",
                    }}
                  >
                    NameSys
                  </div>
                  <div
                    className="flex-column"
                    style={{
                      fontSize: onSearch ? "20px" : "24px",
                      fontWeight: 700,
                      color: "#fc4e14",
                      marginTop: "5px",
                    }}
                  >
                    Advanced
                  </div>
                  <div style={{}}>
                    <button
                      className="button"
                      onClick={() => {
                        window.location.href = isProduction
                          ? "/account.html"
                          : "/account";
                      }}
                      data-tooltip="My Names"
                      disabled={isDisconnected}
                      style={{
                        marginTop: "15px",
                        marginBottom: "-10px",
                      }}
                    >
                      <div className="flex-sans-direction">
                        {"My Names"}&nbsp;
                        <span className="material-icons">
                          admin_panel_settings
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <br></br>
          <br></br>
          <div
            className="main-search-container"
            style={{
              maxHeight: "520px",
              overflowY: "auto",
              marginBottom: "50px",
            }}
          >
            <BigSearch onSearch={handleNameSearch} disabled={!backend} />
          </div>
          {!onSearch && (
            <div>
              <div className="content-slider">
                <div className="slider">
                  <div className="mask">
                    <ul>
                      {C.carousal.map((item, index) => (
                        <li className={`anim${index + 1}`} key={index}>
                          <div className="carousal-item">
                            <div
                              dangerouslySetInnerHTML={{ __html: item }}
                            ></div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div
                className="flex-column"
                style={{
                  paddingBottom: "10px",
                  top: "auto",
                  left: isMobile ? "43%" : "47%",
                  bottom: 10,
                  position: "fixed",
                }}
              >
                <span
                  style={{
                    color: "#fc4e14",
                    fontWeight: "700",
                    fontSize: isMobile ? "10px" : "14px",
                    paddingBottom: "5px",
                  }}
                >
                  {"Funded By"}
                </span>
                <span
                  style={{
                    color: "skyblue",
                    fontWeight: "700",
                    fontSize: isMobile ? "13px" : "20px",
                  }}
                >
                  {"ENS DAO"}
                </span>
              </div>
            </div>
          )}
          {loading && onSearch && (
            <div>
              <div
                className="flex-column"
                style={{
                  marginTop: "-10px",
                  marginBottom: "200px",
                }}
              >
                <div
                  className="flex-column"
                  style={{
                    paddingBottom: "10px",
                  }}
                >
                  <Loading
                    height={isMobile ? 35 : 50}
                    width={isMobile ? 35 : 50}
                  />
                </div>
                <div
                  style={{
                    marginTop: "10px",
                  }}
                >
                  <span
                    style={{
                      fontSize: isMobile ? "17px" : "22px",
                      color: "#ff2600",
                      fontWeight: "700",
                    }}
                  >
                    {"Please Wait"}
                  </span>
                </div>
              </div>
            </div>
          )}
          {!loading && meta.length > 0 && !empty && onSearch && (
            <div>
              <div
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  fontSize: "18px",
                  color: "lightblue",
                  marginBottom: "25px",
                  fontWeight: "700",
                }}
              >
                <span
                  style={{
                    marginRight: "5px",
                  }}
                >
                  search results
                </span>
                <button
                  className="button-tiny"
                  onClick={() => {
                    setHelpModal(true);
                    setIcon("info");
                    setColor("lightblue");
                    setTop("");
                    setHelp("Search results for your query");
                  }}
                >
                  <div
                    className="material-icons smol"
                    style={{
                      color: "lightblue",
                    }}
                  >
                    info_outline
                  </div>
                </button>
              </div>
              <div
                className="list-container"
                style={{
                  maxHeight: "520px",
                  overflowY: "auto",
                  marginBottom: "50px",
                }}
              >
                <List
                  label={
                    (!isDisconnected || isConnected) && manager === _Wallet_
                      ? "edit"
                      : "view"
                  }
                  items={meta}
                  disabled={!backend}
                  onItemClickStealth={onItemClickStealth}
                  onItemClickPreview={onItemClickPreview}
                />
              </div>
            </div>
          )}
          {/* Footer */}
          <div
            className="flex-sans-direction"
            style={{
              color: "#ff2600",
              top: "auto",
              left: !isMobile ? "1%" : "3.5%",
              bottom: 10,
              position: "fixed",
            }}
          >
            <div
              className="flex-row"
              style={{
                marginRight: !isMobile ? "15px" : "5px",
              }}
            >
              <a
                href="https://github.com/namesys-eth"
                className="footer-text flex-row"
                target="_blank"
                rel="noreferrer"
              >
                <span
                  className="material-icons"
                  style={{
                    marginRight: "5px",
                    color: "#ff2600",
                  }}
                >
                  source
                </span>
                <span hidden={isMobile}>GitHub</span>
              </a>
            </div>
            <div className="flex-row">
              <a
                href="readme/readme.htm?src=https://namesys-eth.github.io/ccip2-eth-resources/GUIDE.md"
                className="footer-text flex-row"
                target="_blank"
                rel="noreferrer"
              >
                <span
                  className="material-icons"
                  style={{
                    marginRight: "5px",
                    color: "#ff2600",
                  }}
                >
                  info_outline
                </span>
                <span hidden={isMobile}>Help</span>
              </a>
            </div>
          </div>
          {/* Modals */}
          <div id="modal">
            {previewModal && (
              <Preview
                onClose={() => setPreviewModal(false)}
                show={previewModal}
                _ENS_={nameToPreview}
                chain={C.alchemyConfig.chainId}
                handleParentTrigger={handlePreviewTrigger}
                handleParentModalData={handlePreviewModalData}
              />
            )}
            {stealthModal && (
              <Stealth
                onClose={() => setStealthModal(false)}
                show={stealthModal}
                _ENS_={nameToStealth}
                chain={C.alchemyConfig.chainId}
                handleParentTrigger={handleStealthTrigger}
                handleParentModalData={handleStealthModalData}
              />
            )}
            <Faq onClose={() => setFaqModal(false)} show={faqModal} />
            <Terms onClose={() => setTermsModal(false)} show={termsModal} />
            <Error
              onClose={() => {
                setErrorModal(false);
                setTokenIDLegacy("");
                setTokenIDWrapper("");
                setQuery("");
                setManager("");
              }}
              color={"red"}
              show={errorModal && searchType === "search" && !loading}
              title={"block"}
            >
              {errorMessage}
            </Error>
            <Error
              onClose={() => {
                setErrorModal(false);
              }}
              color={"red"}
              show={errorModal && !backend}
              title={"block"}
            >
              {errorMessage}
            </Error>
            <Help
              color={color}
              icon={icon}
              onClose={() => setHelpModal(false)}
              show={helpModal}
              position={top}
            >
              {help}
            </Help>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
