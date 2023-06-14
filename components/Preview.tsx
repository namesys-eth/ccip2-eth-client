/// ENS Domain Preview Modal
import React from "react"
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { ethers } from 'ethers'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { verifyMessage } from 'ethers/lib/utils'
//import LoadingIcons from 'react-loading-icons'
import { BiError } from 'react-icons/bi'
import Help from '../components/Help'
import Salt from '../components/Salt'
import Gas from '../components/Gas'
import Loading from '../components/LoadingColors'
import Success from '../components/Success'
import * as constants from '../utils/constants'
import { _KEYGEN } from '../utils/keygen'
import * as Name from 'w3name'
import * as ed25519_2 from 'ed25519-2.0.0' // @noble/ed25519 v2.0.0
import * as ensHash from '@ensdomains/content-hash'
import {
  useAccount,
  useFeeData,
  useContractWrite,
  useSignMessage,
  useWaitForTransaction,
  useContractRead
} from 'wagmi' // Legacy Wagmi 1.6
/* →
import {
  usePrepareContractWrite
} from 'wagmi2' // New Wagmi 2.0.0
*/ 

// State to pass back to homepage
interface MainBodyState {
  modalData: string | undefined;
  trigger: boolean;
}

// Modal data to pass back to homepage
interface ModalProps {
  _ENS_: string,
  chain: string,
  show: boolean;
  onClose: any;
  handleParentModalData: (data: boolean) => void;
  handleParentTrigger: (data: boolean) => void;
}

/// Init 
// Types object with empty strings
function EMPTY_STRING() {
  const EMPTY_STRING = {};
  for (const key of constants.types) {
    if (key !== 'resolver') {
      EMPTY_STRING[key] = '';
    }
  }
  return EMPTY_STRING
}

// Types object with empty bools
function EMPTY_BOOL() {
  const EMPTY_BOOL = {};
  for (const key of constants.types) {
    EMPTY_BOOL[key] = ['resolver'].includes(key) ? true : false;
  }
  return EMPTY_BOOL
}

// History object with empty strings
const EMPTY_HISTORY = {
  addr: '',
  contenthash: '',
  avatar: '',
  revision: '',
  type: ''
}

// Init ABI Encoder
const abi = ethers.utils

/// Library
// Check if image URL resolves
function checkImageURL(url: string) {
  return new Promise(function(resolve, reject) {
    var img = new Image();
    img.onload = function() {
      resolve(true);
    };
    img.onerror = function() {
      reject(false);
    };
    img.src = url;
  });
}

// Returns ed25519/IPNS keypair formatted for sure
function formatkey(keypair: [[string, string], [string, string]]) {
  return '08011240' + keypair[0][0] + keypair[0][1] // ed25519 keypair = keypair[0]
}

// Encode ENS contenthash
function encodeContenthash(contenthash: string) {
  const matched = contenthash.match(/^(ipfs|sia|ipns|bzz|onion|onion3|arweave):\/\/(.*)/)
    || contenthash.match(/\/(ipfs)\/(.*)/)  
    || contenthash.match(/\/(ipns)\/(.*)/)
    if (matched) {
      const contentType = matched[1]
      const content = matched![2]
      const ensContentHash = ensHash.contentHash.encode(`${contentType}-ns`, content)
      return ensContentHash
    }
    return ''
}

/**
* Preview Modal
* @param show : Show modal trigger
* @param onClose : Close modal trigger
* @param _ENS_ : Native ENS domain for modal
* @param chain : Chain ID
* @interface handleParentModalData : Send modal data to Home/Account-page
* @interface handleParentTrigger : Send modal state to Home/Account-page
**/
const Preview: React.FC<ModalProps> = ({ show, onClose, _ENS_, chain, handleParentModalData, handleParentTrigger }) => {
  const [browser, setBrowser] = React.useState(false); // Triggers at modal load
  const { data: gasData, isError } = useFeeData(); // Current gas prices
  const [loading, setLoading] = React.useState(true); // Loading process indicator
  const [migrated, setMigrated] = React.useState(false); // Setup indicator; Setup = Resolver migration + newRecordhash setting
  const [keygen, setKeygen] = React.useState(false); // IPNS keygen trigger following signature
  const [crash, setCrash] = React.useState(false);  // Signature fail indicator
  const [CID, setCID] = React.useState(''); // IPNS pubkey/CID value
  const [helpModal, setHelpModal] = React.useState(false); // Help modal trigger
  const [successModal, setSuccessModal] = React.useState(false); // Success modal trigger
  const [gasModal, setGasModal] = React.useState(false); // Gas savings modal trigger
  const [finish, setFinish] = React.useState(false); // Indicates when all records have finished fetching
  const [resolver, setResolver] = React.useState<any>(); // Resolver for ENS Domain
  const [addr, setAddr] = React.useState(''); // Addr record for ENS Domain
  //const [addr60, setAddr60] = React.useState('');
  const [avatar, setAvatar] = React.useState(''); // Avatar record for ENS Domain
  const [recordhash, setRecordhash] = React.useState(''); // newRecordhash for CCIP2 Resolver
  const [tokenID, setTokenID] = React.useState(''); // Token ID of ENS Domain
  const [managers, setManagers] = React.useState<string[]>([]); // Manager of ENS Domain
  const [contenthash, setContenthash] = React.useState(''); // Contenthash record for ENS Domain
  const [newRecordhash, setNewRecordhash] = React.useState(''); // Name record (Reverse Record) for ENS Domain
  const [salt, setSalt] = React.useState(false); // Salt (password/key-identifier) for IPNS keygen
  const [list, setList] = React.useState<any[]>([]); // Internal LIST[] object with all record keys and values
  const [trigger, setTrigger] = React.useState(null); // Triggered upon button click adjacent to the record in Preview modal
  const [help, setHelp] = React.useState(''); // Sets help text for the Help modal
  const [success, setSuccess] = React.useState(''); // Sets success text for the Success modal
  const [gas, setGas] = React.useState<{}>({}); // Sets historical gas savings
  const [wrapped, setWrapped] = React.useState(false); // Indicates if the ENS Domain is wrapped
  const [keypair, setKeypair] = React.useState<[[string, string], [string, string]]>(); // Sets generated K0 and K2 keys
  const [update, setUpdate] = React.useState(false); // Triggers signature for record update
  const [write, setWrite] = React.useState(false); // Triggers update of record to the NameSys backend and IPNS
  const [states, setStates] = React.useState<any[]>([]); // Contains keys of active records (that have been edited in the modal)
  const [newValues, setNewValues] = React.useState(EMPTY_STRING()); // Contains new values for the active records in {a:b} format
  const [icon, setIcon] = React.useState(''); // Sets icon for the loading state
  const [color, setColor] = React.useState(''); // Sets color for the loading state
  const [message, setMessage] = React.useState(['Loading Records','']); // Sets message for the loading state
  const [signatures, setSignatures] = React.useState<string[]>([]); // Contains S2(K0) signatures of active records in the modal
  const [query, setQuery] = React.useState(''); // CCIP2 Query for on-chain manager
  const [legit, setLegit] = React.useState(EMPTY_BOOL()); // Whether record edit is legitimate
  const [imageLoaded, setImageLoaded] = React.useState<boolean | undefined>(undefined); // Whether avatar resolves or not
  const [modalState, setModalState] = React.useState<MainBodyState>({
    modalData: undefined,
    trigger: false
  }); // Child modal state
  const [history, setHistory] = React.useState(EMPTY_HISTORY); // Record history from last update
  const [sigIPNS, setSigIPNS] = React.useState(''); // Signature S1(K1) for IPNS keygen
  //const [sigRecord, setSigRecord] = React.useState(''); // Signature S2(K0) for Record update
  //const [sigApproved, setApproved] = React.useState(''); // Signature S3(K1) for Records Manager

  const { Revision } = Name // W3Name Revision object
  const { data: accountData } = useAccount()
  const recoveredAddress = React.useRef<string>()
  const { 
    data: signature, 
    error: signError, 
    isLoading: signLoading, 
    signMessage 
  } = useSignMessage({
    onSuccess(data, variables) {
      const address = verifyMessage(variables.message, data)
      recoveredAddress.current = address
    },
  })  // Wagmi Signature hook

  const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_ID
  const network = process.env.NEXT_PUBLIC_NETWORK === 'goerli' ? 'goerli' : 'homestead'
  const provider = new ethers.providers.AlchemyProvider(network, apiKey);
  const alchemyEndpoint = 'https://eth-goerli.g.alchemy.com/v2/' + apiKey
  const web3 = new Web3(alchemyEndpoint);
  let caip10 = `eip155:${chain}:${accountData?.address}`  // CAIP-10
  let labelhash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(_ENS_.split('.eth')[0]))
  let token = ethers.BigNumber.from(labelhash)
  const zeroAddress = '0x' + '0'.repeat(40)

  // Initialises internal LIST[] object
  function setMetadata() {
    let _LIST = [
      {
        key: 0,
        type: 'recordhash',
        value: recordhash,
        editable: resolver === constants.ccip2[0],
        active: isContenthash(recordhash),
        state: false,
        label: 'set new',
        help: 'on-chain recordhash'
      },
      {
        key: 1,
        type: 'resolver',
        value: resolver,
        editable: false,
        active: resolver !== constants.ccip2[0],
        state: false,
        label: 'migrate',
        help: 'please migrate resolver to enjoy off-chain records'
      },
      {
        key: 2,
        type: 'avatar',
        value: avatar,
        editable: resolver === constants.ccip2[0],
        active: isAvatar(avatar),
        state: false,
        label: 'edit',
        help: 'set your avatar'
      },
      {
        key: 3,
        type: 'addr',
        value: addr,
        editable: resolver === constants.ccip2[0],
        active: isAddr(addr),
        state: false,
        label: 'edit',
        help: 'set your default address'
      },
      {
        key: 4,
        type: 'contenthash',
        value: contenthash,
        editable: resolver === constants.ccip2[0],
        active: isContenthash(contenthash),
        state: false,
        label: 'edit',
        help: 'set your web contenthash'
      }
    ]
    finishQuery(_LIST) // Assign _LIST
  }

  // Signature S1 statement; S1(K1)
  function statementIPNSKey() {
    return `Requesting Signature For IPNS Key Generation\n\nUsername: ${_ENS_}\nSigned By: ${caip10}`
  }
  // Signature S2 statement; S2(K0)
  function statementRecords(recordType: string, extradata: string) {
    return `Requesting Signature To Update Off-Chain ENS Record\n\nENS Domain: ${_ENS_}\nRecord Type: ${recordType}\nExtradata: ${extradata}\nSigned By: ${caip10}`
  }

  // Signature S3 statement; S3(K1)
  function statementManager(manageFor: string) {
    return `Requesting Signature To Approve Off-Chain ENS Records Manager Key\n\nENS Domain: ${_ENS_}\nApproved For: ${manageFor}\nSigned By: ${caip10}`
  }

  // Generate Record Type suffix
  function genSignerType() {
    let _signer: string
    if (_CCIP2Manager_) {
      // bytes4(keccak256('recordhash(bytes32)'))
      _signer = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("recordhash(bytes32)")).substring(0,8)
    } else {
      // bytes4(keccak256('approved(bytes32, address)'))
      _signer = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("approved(bytes32,address)")).substring(0,8)
    }
    return _signer
  }

  // Generate extradata
  function genExtradata(_recordValue: string) {
    // returns bytesToHexString(abi.encodePacked(keccak256(result)))
    const toPack = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(_recordValue))
    const _extradata = ethers.utils.hexlify(abi.solidityPack(["bytes"], [toPack]))
    //console.log(_extradata)
    return _extradata
  }

  // Signature S2 with K0
  async function _signMessage(input: any) {
    if (keypair) {
      const SignS2 = async () => {
        const _signer = new ethers.Wallet('0x' + keypair[1][0], provider)
        const __signature = await _signer.signMessage(input.message) 
        if (__signature) return __signature
      }
      setQuery(
        abi.solidityKeccak256(
        // ["manager", node, owner, signer]
        ["string", "bytes32", "address", "address"], 
        ["manager", ethers.utils.namehash(_ENS_), getOwner(), keypair ? `0x${keypair[1][1]}` : zeroAddress]
      ))
      const _signature = SignS2() 
      return _signature
    }
  }
      
  // Handle secondary modal data return
  const handleModalData = (data: string | undefined) => {
    setModalState(prevState => ({ ...prevState, modalData: data }));
  };
  // Handle secondary modal trigger
  const handleTrigger = (trigger: boolean) => {
    setModalState(prevState => ({ ...prevState, trigger: trigger }));
  };

  /// Preview Domain Metadata
  // Read Legacy ENS Registry for ENS domain Controller
  const { data: _ControllerLegacy_ } = useContractRead(
    constants.ensConfig[1],
    'getApproved',
    {
      args: [
        tokenID
      ]
    }
  )
  // Read Legacy ENS Registry for ENS domain Owner
  const { data: _OwnerLegacy_ } = useContractRead(
    constants.ensConfig[1],
    'ownerOf',
    {
      args: [
        tokenID
      ]
    }
  )
  // Read CCIP2 for ENS domain on-chain manager
  const { data: _CCIP2Manager_ } = useContractRead(
    constants.ccip2Config[0],
    'manager',
    {
      args: [
        query
      ]
    }
  )
  // Read ownership of a domain from ENS Wrapper
  const { data: _OwnerWrapped_ } = useContractRead(
    constants.ensConfig[3], // ENS Wrapper
    'ownerOf',
    {
      args: [
        tokenID
      ]
    }
  )
  // Get newRecordhash from CCIP2 Resolver
  const { data: _Recordhash_ } = useContractRead(
    constants.ccip2Config[0], // CCIP2 Resolver
    'recordhash',
    {
      args: [
        ethers.utils.namehash(_ENS_)
      ]
    }
  )
  // Get Manager from ENS Wrapper
  const { data: _ManagerWrapped_ } = useContractRead(
    constants.ensConfig[3], // ENS Wrapper
    'getApproved',
    {
      args: [
        tokenID
      ]
    }
  )

  // Returns Owner of wrapped/legacy ENS Domain
  function getOwner() {
    // If domain is wrapped, return owner of token (in new contract) as the controller
    if (_OwnerLegacy_?.toString() === constants.ensContracts[3]) {
      return _OwnerWrapped_ ? _OwnerWrapped_.toString() : zeroAddress
    } else {
      // If domain is unwrapped, return owner of token (in legacy contract) as the controller
      return _OwnerLegacy_ ? _OwnerLegacy_.toString() : zeroAddress
    }
  }

  // Returns Controller of wrapped/legacy ENS Domain
  function getController() {
    // If domain is wrapped, return manager of token (in new contract) as the controller
    if (_OwnerLegacy_?.toString() === constants.ensContracts[3]) {
      
      return _ManagerWrapped_ ? _ManagerWrapped_.toString() : zeroAddress
    } else {
      // If domain is unwrapped, return manager of token (in legacy contract) as the controller
      return _ControllerLegacy_ ? _ControllerLegacy_.toString() : zeroAddress
    }
  }

  // Sets in-app ENS domain manager
  React.useEffect(() => {
    if (accountData?.address) {
      let _OwnerWrapped_ = getOwner()
      let _ManagerWrapped_ = getController()
      // Set Managers
      if (_CCIP2Manager_ && _CCIP2Manager_.toString() === 'true') {
        // Set connected account as in-app manager if it is authorised
        setManagers([accountData.address])
      } else {
        // Set owner and controller as in-app managers if no on-chain manager exists
        setManagers([_OwnerWrapped_, _ManagerWrapped_])
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenID, _ControllerLegacy_, _OwnerLegacy_, _CCIP2Manager_])

  // Sets Wrapper status of ENS Domain
  React.useEffect(() => {
    if (_OwnerLegacy_?.toString() === constants.ensContracts[3]) {
      setWrapped(true)
    } else {
      setWrapped(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_OwnerLegacy_])

  // Send data to Home/Account-page and trigger update
  const handleSuccess = () => {
    handleParentModalData(true);
    handleParentTrigger(true);
  };

  // Handles loading of avatar
  React.useEffect(() => {
    checkImageURL(avatar)
      .then(() => setImageLoaded(true))
      .catch(() => setImageLoaded(false));
  }, [avatar]);

  // Triggers upon Preview load and attempts to get Resolver for ENS domain
  React.useEffect(() => {
    setBrowser(true) 
    if (browser) {
      setTokenID(token.toString())
      getResolver()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [browser]);
 
  // Triggers S1(K1) after password is set
  React.useEffect(() => {
    if (modalState.trigger && !update) {
      signMessage({ message: statementIPNSKey() })
      setKeygen(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState]);

  // Triggers S1(K1) after password is set
  React.useEffect(() => {
    setLoading(true)
    if (sigIPNS && !keypair) {
      setMessage(['Generating IPNS Key', ''])
      const keygen = async () => {
        const __keypair = await _KEYGEN(_ENS_, caip10, sigIPNS, modalState.modalData)
        setKeypair(__keypair)
        setMessage(['IPNS Key Generated', ''])
      };
      keygen()
    } else {
      setMessage(['IPNS Key/CID Exists', ''])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keygen, sigIPNS]);

  // Triggers IPNS CID derivation with new S1(K1)
  React.useEffect(() => {
    if (keypair) {
      const CIDGen = async () => {
        let key = formatkey(keypair)
        const w3name = await Name.from(ed25519_2.etc.hexToBytes(key))
        const CID_IPNS = w3name.toString()
        setCID(CID_IPNS)
        setMessage(['IPNS CID Generated', ''])
      }
      CIDGen()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keypair]);

  // Sets signature from Wagmi signMessage() as S1(K1)
  React.useEffect(() => {
    if (signature) {
      setSigIPNS(signature)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature])

  // Sets new ENS Resolver
  const {
    data: response1of2,
    write: migrate,
    isLoading: isMigrateLoading,
    isSuccess: isMigrateSuccess,
  } = useContractWrite(
    !wrapped ? constants.ensConfig[0] : constants.ensConfig[3],
    'setResolver',
    {
      args: [
        ethers.utils.namehash(_ENS_), 
        constants.ccip2[0]
      ]
    }
  );

  // Sets newRecordhash in CCIP2 Resolver
  // FIXME : NOT TRIGGERING !!!
  const {
    data: response2of2,
    write: initRecordhash,
    isLoading: isSetRecordhashLoading,
    isSuccess: isSetRecordhashSuccess,
  } = useContractWrite(
    constants.ccip2Config[0],
    'setRecordhash',
    {
      args: [
        ethers.utils.namehash(_ENS_), 
        encodeContenthash(CID)
      ]
    }
  );


  /* → 
  async function getGas(key: string, value: string) {
    const { 
      config: config, 
      error: _error 
    } = usePrepareContractWrite(
      {
        address: `0x${constants.ensConfig[4].addressOrName.substring(2)}`,
        abi: constants.ensConfig[4].contractInterface,
        functionName: 'setText',
        args: [ethers.utils.namehash(_ENS_), key, value]
      }
    )
    return {
      config,
       _error
    }
  }
  */

  // Get gas cost estimate for hypothetical on-chain record update
  async function getGas(key: string, value: string) {
    const getGasAmountForContractCall = async () => {
      const contract = new web3.eth.Contract(
        constants.ensConfig[4].contractInterface as AbiItem[], 
        constants.ensConfig[4].addressOrName
      );
      let gasAmount = await contract.methods.setText(ethers.utils.namehash(_ENS_), key, value).estimateGas({ from: accountData?.address })
      return gasAmount
    }
    const gas = await getGasAmountForContractCall()
    return gas
  }
  
  // Triggers Resolver migration after IPNS CID is generated and validated 
  React.useEffect(() => {
    if (states.includes('resolver')) {
      if (CID.startsWith('k5')) {
        migrate()
      }
    } else {
      setMessage(message)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CID, states]);

  // Handles single vs. mulitple record updates
  React.useEffect(() => {
    if (states.length > 1) {
      const _updatedList = list.map((item) => {
        if (item.type !== 'resolver' && 
          states.includes(item.type) 
        ) 
        {
          return { 
            ...item, 
            label: 'edit all',
            help: 'set multiple records in one click'
          };
        } else {
          return { 
            ...item, 
            label: item.type !== 'resolver' ? 'edit' : 'migrate'
          };
        }
      });
      setList(_updatedList)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [states]);

  // Handle Preview modal close
  const handleCloseClick = (e: { preventDefault: () => void; }) => {
    setLegit(EMPTY_BOOL())
    setLoading(false)
    const _updatedList = list.map((item) => {
      return { 
        ...item,  
        active: resolver !== constants.ccip2[0]
      };
    })
    setList(_updatedList)
    setStates([])
    setCID('')
    setKeypair(undefined) // Purge keypairs from local storage 
    setNewValues(EMPTY_STRING())
    e.preventDefault();
    onClose();
  };

  // Finish query for ENS domain records
  function finishQuery(data: React.SetStateAction<any[]> | undefined) {
    if ( data ) {
      setList(data)
      setLoading(false)
    }
  }

  // Get Contenthash for ENS domain first
  async function getContenthash(resolver: ethers.providers.Resolver | null) {
    if ( resolver?.address !== constants.ccip2[0] ) {
      await resolver!.getContentHash()
        .then((response: React.SetStateAction<string>) => {
          if (!response) {
            setContenthash('')
          } else {
            setContenthash(response)
          }
          getAvatar()
        })
        .catch(() => {
          setContenthash('')
          getAvatar()
        });
    } else {
      // TODO : Fix this
      setContenthash('')
      getAvatar()
    }
  }

  // Get Avatar for ENS domain second
  async function getAvatar() {
    if ( resolver?.address !== constants.ccip2[0] ) {
      await provider.getAvatar(_ENS_)
        .then(response => {
          if (!response) {
            setAvatar('')
          } else {
            setAvatar(response)
          }
          getRecord()
        })
        .catch(() => {
          setAvatar('')
          getRecord()
        });
    } else {
      // TODO : Fix this
      setAvatar('')
      getRecord()
    }
  }

  // Get Addr for ENS domain third
  async function getRecord() {
    if ( resolver?.address !== constants.ccip2[0] ) {
      await provider.resolveName(_ENS_)
        .then(response => {
          if (!response) {
            setAddr('')
          } else {
            setAddr(response)
          }
          getName()
        })
        .catch(() => {
          setAddr('')
          getName()
        });
    } else {
      // TODO : Fix this
      setAddr('')
      getName()
    }
  }

  // Get Name for ENS domain last & finish
  // TODO: getName() routine for both ENS contract versions
  async function getName() {
    if ( resolver?.address !== constants.ccip2[0] ) {
      setNewRecordhash(_ENS_)
    } else {
      setNewRecordhash(_ENS_)
    }
    setFinish(true)
  }

  // Get Resolver for ENS domain
  async function getResolver() {
    await provider.getResolver(_ENS_)
      .then(response => {
        setResolver(response?.address);
        if (response?.address) {
          if (resolver === constants.ccip2Config[0]) {
            setRecordhash(_Recordhash_!.toString())
          }
          getContenthash(response!)
        }
      });
  }

  // Function for writing IPNS Revision metadata to NameSys backend; needed for updates
  async function writeRevision(revision: Name.Revision, gas: {}) {
    const request = {
      ens: _ENS_,
      address: accountData?.address,
      signature: sigIPNS,
      revision: Revision.encode(revision),
      chain: chain,
      gas: JSON.stringify(gas), 
      version: JSON.stringify(revision, (key, value) => {
        return typeof value === 'bigint' ? value.toString() : value;
      })
    }
    try {
      await fetch(
        "https://sshmatrix.club:3003/revision",
        {
          method: "post",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request)
        })
        .then(response => response.json())
        .then(data => {
          if (data.status) {
            return data.status === 'true'
          } else {
            return false
          }
        })
    } catch(error) {
      console.log('Failed to write Revision to CCIP2 backend')
      setMessage(['Record Update Failed', ''])
      setCrash(true)
    }
  }

  // Check if value is a valid Name
  function isName(value: string) {
    return value.endsWith('.eth') && value.length <= 32 + 4
  }

  // Check if value is a valid Addr
  function isAddr(value: string) {
    const hexRegex = /^[0-9a-fA-F]+$/;
    return value.startsWith('0x') && value.length === 40 && hexRegex.test(value.split('0x')[1])
  }

  // Check if value is a valid Avatar URL
  function isAvatar(value: string) {
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlRegex.test(value)
  }
  // Check if value is a valid Contenthash
  function isContenthash(value: string) {
    const ipfsRegex = /^[a-z0-9]{62}$/;
    return ipfsRegex.test(value)
  }

  // Upates new record values in local storage before pushing updates
  function setValues(key: string, value: string) {
    let __THIS = legit
    __THIS['resolver'] = false
    if (key === 'recordhash') {
      //__THIS[key] = isName(value)
      __THIS[key] = false
    } else if (key === 'addr') {
      __THIS[key] = isAddr(value)
    } else if (key === 'avatar') {
      __THIS[key] = isAvatar(value)
    } else if (key === 'contenthash') {
      __THIS[key] = isContenthash(value)
    } else {
      // @CHECKPOINT: should never trigger
      setStates(prevState => [...prevState, key])
      return
    }
    setLegit(__THIS)
    const _THIS = newValues;
    _THIS[key] = value;
    setNewValues(_THIS)
    const priorState = states
    if (!priorState.includes(key) && newValues[key]) {
      setStates(prevState => [...prevState, key])
    } else if (priorState.includes(key) && !newValues[key]) {
      setStates(prevState => prevState.filter(item => item !== key))
    }
    const _updatedList = list.map((item) => {
      if (states.includes(item.type)) {
        return { 
          ...item, 
          editable: true, 
          active: true,
          state: false
        };
      }
      return item;
    });
    setList(_updatedList)
  }

  // Get records from history on NameSys backend
  // Must get Revision for IPNS update
  async function getUpdate() {
    const request = {
      type: 'read',
      ens: _ENS_,
      address: accountData?.address,
      recordsTypes: 'all',
      recordsValues: 'all',
      chain: chain
    }
    try{
      await fetch(
        "https://sshmatrix.club:3003/read",
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request)
        })
        .then(response => response.json())
        .then(data => {
          let _history = {
            type: data.type,
            addr: data.addr,
            avatar: data.avatar,
            contenthash: data.contenthash,
            revision: data.revision
          }
          setHistory(_history)
        })
    } catch(error) {
      console.log('Failed to read from CCIP2 backend')
    }
  }

  // Triggers fetching history from NameSys backend
  React.useEffect(() => {
    if (finish) {
      getUpdate()
      setMetadata()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finish]);

  // Wagmi hook for awaiting transaction processing
  const { isSuccess: txSuccess1of2, isError: txError1of2, isLoading: txLoading1of2 } = useWaitForTransaction({
    hash: response1of2?.hash,
  });
  const { isSuccess: txSuccess2of2, isError: txError2of2, isLoading: txLoading2of2 } = useWaitForTransaction({
    hash: response2of2?.hash,
  });

  // Internal state handling of editable/active records during updates by user
  React.useEffect(() => {
    const _updatedList = list.map((item) => {
      if (states.includes(item.type) && !constants.forbidden.includes(item.type)) {
        return { 
          ...item, 
          editable: true, 
          active: true 
        };
      } else if (!states.includes(item.type) && ['resolver'].includes(item.type)) {
        return { 
          ...item, 
          editable: false, 
          active: false
        };
      } else if (['recordhash'].includes(item.type)) {
        return { 
          ...item, 
          editable: false, 
          active: false
        };
      }
      return item;
    });
    setList(_updatedList)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  // Handles password prompt for S1(K1)
  React.useEffect(() => {
    if (update) { // Check for false → true
      if (!keypair || !CID) {
        setSalt(true) // Start K0 keygen if it doesn't exist in local storage
        setUpdate(false) // Reset
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  // Handles generating signatures for all records to be updated
  React.useEffect(() => {
    // Handle Signature (S2) to add as extradata
    if (write && keypair && newValues) {
      let __signatures: string[] = []
      states.forEach(async (_recordType) => {
        const _signature = await _signMessage({ 
          message: statementRecords(constants.files[constants.types.indexOf(_recordType)], genExtradata(newValues[_recordType])) 
        }) // Sign with K0
        if (_signature) __signatures.push(_signature)
      });
      setSignatures(__signatures)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [write, keypair]);

  // Handles writing records to the NameSys backend and pinning to IPNS
  React.useEffect(() => {
    if (
      write && 
      keypair && 
      signatures.length === states.length && 
      signatures.length > 0
    ) {
      // Generate POST request for writing records
      const request = {
        signatures: signatures,
        ens: _ENS_,
        address: recoveredAddress.current,
        ipns: CID,
        recordsTypes: states,
        recordsValues: newValues,
        revision: history.revision,
        chain: chain
      }
      //console.log(request)
      const editRecord = async () => {
        setMessage(['Writing Records', ''])
        try {
          await fetch(
            "https://sshmatrix.club:3003/write",
            {
              method: "post",
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(request)
            })
            .then(response => response.json())
            .then(async data => {
              setMessage(['Publishing to IPNS', ''])
              if (keypair && data.response) {	
                // Get gas consumption estimate
                let gas = {}	
                list.map(async (item) => {	
                  if (item.type !== 'resolver' && data.response.meta[item.type]) {	
                    // Get gas for each record separately	
                    const _gas = getGas(item.type, data.response[item.type])	
                    const _promise = async () => {	
                      await Promise.all([_gas])	
                    }
                    await _promise()	
                    _gas.then((value) => {	
                      gas[item.type] = value * gasData?.gasPrice!?.toNumber() * 0.000000001 * 0.000000001	
                    })	
                    if (item.type === 'avatar') {	
                      setAvatar(data.response.avatar)	
                    }	
                  }
                })	
                // Wait for gas to be estimated
                await new Promise<void>(resolve => {
                  const checkGas = () => {
                    if (Object.keys(gas).length > 0) {
                      resolve()
                    } else {
                      setTimeout(checkGas, 100)
                    }
                  }
                  checkGas()
                })
                // Handle W3Name publish 
                let key = formatkey(keypair)
                let w3name: Name.WritableName
                const keygen = async () => {
                  w3name = await Name.from(ed25519_2.etc.hexToBytes(key))
                  const pin = async () => {
                    if (data.response.ipfs && w3name && gas) {
                      const toPublish = '/ipfs/' + data.response.ipfs.split('ipfs://')[1]
                      // @W3Name broadcast
                      let _revision: Name.Revision;
                      if (!history.revision) {
                        _revision = await Name.v0(w3name, toPublish)
                      } else {
                        let _revision_ = Revision.decode(new Uint8Array(Buffer.from(history.revision, "utf-8")))
                        _revision = await Name.increment(_revision_, toPublish)
                      }
                      // Write revision to database
                      await writeRevision(_revision, gas)
                      // Publish IPNS
                      await Name.publish(_revision, w3name.key)
                      // Wrap up
                      setGas(gas)
                      setTimeout(() => {
                        setGasModal(true)
                        setLoading(false)
                        //setCID('')
                        //setKeypair(undefined)
                        states.map((_state) => {
                          setStates(prevState => prevState.filter(item => item !== _state))
                        })
                        setLegit(EMPTY_BOOL())
                      }, 2000);
                      const _updatedList = list.map((item) => {
                        if (item.type !== 'resolver' && data.response.meta[item.type]) {
                          return { 
                            ...item,  
                            value: data.response[item.type],
                            state: true,
                            label: 'edit'
                          };
                        } else {
                          return item
                        }
                      })
                      setList(_updatedList)
                      setNewValues(EMPTY_STRING())
                    }
                  }
                  if (Object.keys(gas).length > 0) {
                    pin()
                  }
                }
                keygen()
              }
            })
        } catch(error) {
          console.log('Failed to write to CCIP2 backend')
          setMessage(['Record Update Failed', ''])
          setCrash(true)
        }
      }
      editRecord()
      setWrite(false)
    }
    // Handle exception
    if (!write) {
      setUpdate(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signatures]);

  // Handles setting setRecordhash on CCIP2 Resolver
  React.useEffect(() => {
    if (isMigrateSuccess && txSuccess1of2 && migrated) {
      initRecordhash()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMigrateSuccess, txSuccess1of2, migrated]);

  // Handles finishing migration of Resolver to CCIP2
  React.useEffect(() => {
    if (
      isMigrateSuccess && 
      txSuccess1of2 && 
      migrated &&
      isSetRecordhashSuccess &&
      txSuccess2of2
    ) {
      setResolver(constants.ccip2[0])
      const _updatedList = list.map((item) => {
        if (constants.forbidden.includes(item.type)) {
          return { 
            ...item, 
            editable: false, 
            active: false
          };
        } else {
          return { 
            ...item, 
            value: '',
            editable: true, 
            active: true 
          };
        }
        return item;
      });
      setList(_updatedList)
      setLegit(EMPTY_BOOL())
      setStates([])
      getResolver()
      setSuccess('Resolver is migrated and setRecordhash is set. Enjoy!')
      setIcon('check_circle_outline')
      setColor('lightgreen')
      setSuccessModal(true)
      //setCID('')
      //setKeypair(undefined)
      handleSuccess()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSetRecordhashSuccess, txSuccess2of2]);

  // Sets migration state to true upon successful transaction receipt
  React.useEffect(() => {
    if (isMigrateSuccess && txSuccess1of2) {
      const pin = async () => {
        console.log('Resolver Migration Successful')
        setMigrated(true)
      }
      pin()
    }
  }, [isMigrateSuccess, txSuccess1of2]);

  // Handles transaction wait
  React.useEffect(() => {
    if (isMigrateLoading && !isSetRecordhashLoading) {
      setFinish(false)
      setMessage(['Waiting for Confirmation', '1'])
    }
    if (!isMigrateLoading && isSetRecordhashLoading) {
      setFinish(false)
      setMessage(['Waiting for Confirmation', '2'])
    }
  }, [isMigrateLoading, isSetRecordhashLoading]);

  // Handles first transaction loading and error
  React.useEffect(() => {
    if (txLoading1of2 && !txError1of2) {
      setMessage(['Waiting for Transaction', '1'])
      setCrash(false)
    }
    if (!txLoading1of2 && txError1of2) {
      setMessage(['Transaction Failed', '1'])
      setCrash(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txLoading1of2, txError1of2]);

  // Handles second transaction loading and error
  React.useEffect(() => {
    if (txLoading2of2 && !txError2of2) {
      setMessage(['Waiting for Transaction', '2'])
      setCrash(false)
    }
    if (!txLoading2of2 && txError2of2) {
      setMessage(['Transaction Failed', '2'])
      setCrash(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txLoading2of2, txError2of2]);

  // Handles signature loading and error
  React.useEffect(() => {
    if (signLoading && !signError) {
      setMessage(['Waiting for Signature', ''])
      setCrash(false)
    }
    if (signError && !signLoading) {
      setMessage(['Signature Failed', ''])
      setCrash(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signLoading, signError]);

  /// Modal Content
  const modalContent = show ? (
    <StyledModalOverlay>
      <StyledModal
        style={{
          background: crash ? 'red' : 'linear-gradient(180deg, rgba(66,46,40,1) 0%, rgba(0,0,0,1) 35%, rgba(0,0,0,1) 100%)'
        }}
      >
        <StyledModalHeader>
          <a href="#" onClick={handleCloseClick}>
            <span 
              className="material-icons"
              style={{
                marginTop: '7px'
              }}
            >
              close
            </span>
          </a>
        </StyledModalHeader>
        {_ENS_ && !crash && loading && 
          <StyledModalTitle>
            <span 
              className="material-icons miui-small"
              style={{
                marginTop: '4px'
              }}
            >
            </span>
          </StyledModalTitle>
        }
        {_ENS_ && avatar && imageLoaded && !loading && list.length > 0 &&
          <StyledModalTitle>
            <img 
              // TODO: async-await for resolution across multiple public gateways 
              //src={ avatar.replace('ipfs.io','pinata.cloud') } 
              src={ avatar }
              width={ '100px' }
              alt={ _ENS_ }
              onError={() => setImageLoaded(false)}
            />
          </StyledModalTitle>
        }
        {_ENS_ && (!avatar || !imageLoaded) && !loading && list.length > 0 &&
          <StyledModalTitle>
            <span 
              className="material-icons miui"
              style={{
                marginTop: '4px'
              }}
            >
              portrait
            </span>
          </StyledModalTitle>
        }
        {loading && !crash && 
          <StyledModalBody>
            <div
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'column',
                marginTop: '-10px',
                marginBottom: '80px'
              }}
            >
              <div>
                <Loading 
                  height={50}
                  width={50}
                />
              </div>
              <div
                style={{
                  marginTop: '60px'
                }}
              >
                <span 
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '700'
                  }}
                >
                  { message[0] }
                </span>
              </div>
              { message[1] && (
                <div
                  style={{
                    marginTop: '10px'
                  }}
                >
                  <span 
                    style={{
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: '700'
                    }}
                  >
                    <span style={{ fontFamily: 'SF Mono', fontSize: '22px' }}>{message[1]}</span>
                    <span>{' Of '}</span>
                    <span style={{ fontFamily: 'SF Mono', fontSize: '22px' }}>{'2'}</span>
                  </span>
                </div>
              )}
            </div>
          </StyledModalBody>
        }
        {crash && 
          <StyledModalBody>
            <div
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'column',
                marginTop: '-20px',
                marginBottom: '20px',
                color: 'white',
                fontSize: '150px',
                backgroundColor: 'red'
              }}
            >
              <BiError />
              <div
                style={{
                  marginTop: '-70px'
                }}
              >
                <span 
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '700'
                  }}
                >
                  { message }
                </span>
              </div>
            </div>
          </StyledModalBody>
        }
        {list.length > 0 && !loading && 
          <StyledModalBody>
            <ul
              style={{
                listStyle: 'none',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
              }}>
              {list.map((item) => (
                <li
                  key={item.key}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '500px',
                    maxWidth: '85%',
                    paddingLeft: '20px',
                    paddingRight: '20px'
                  }}
                >
                  <div id="modal-inner">
                    <Help
                      color={ color }
                      _ENS_={ icon }
                      onClose={() => setHelpModal(false)}
                      show={helpModal}
                    >
                      <span>{ help }</span>
                    </Help>
                    <Success
                      color={ color }
                      _ENS_={ icon }
                      onClose={() => setSuccessModal(false)}
                      show={successModal}
                    >
                      <span>{ success }</span>
                    </Success>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      flexDirection: 'column'
                    }}
                  >
                    <div 
                      style={{                      
                        marginBottom: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%'
                      }}
                    >
                      <span 
                        style={{ 
                          fontFamily: 'Spotnik',
                          fontWeight: '700',
                          fontSize: '15px',
                          color: 'skyblue',
                          marginRight: '15px'
                        }}
                      >
                        { item.type }
                        { item.type !== 'resolver' && (
                          <button 
                            className="button-tiny"
                            onClick={() => { 
                              setHelpModal(true),
                              setIcon('info'),
                              setColor(['recordhash'].includes(item.type) ? 'rgb(255, 255, 255, 0.60)' : 'skyblue'),
                              setHelp(item.help)
                            }}
                          >
                            <div 
                              className="material-icons smol"
                              style={{ 
                                color: ['recordhash'].includes(item.type) ? 'rgb(255, 255, 255, 0.60)' : 'skyblue'
                              }}
                            >
                              info_outline
                            </div>
                          </button>
                        )}
                        { item.state && (
                          <div 
                            className="material-icons smol"
                            style={{ 
                              color: 'lightgreen'
                            }}
                          >
                            task_alt
                          </div>
                        )}

                        { // Set Badge if Resolver is migrated and newRecordhash is set
                        ['resolver'].includes(item.type) && resolver === constants.ccip2[0] && recordhash && (
                          <button 
                            className="button-tiny"
                            onClick={() => { 
                              setHelpModal(true),
                              setIcon('gpp_good'),
                              setColor('lightgreen'),
                              setHelp('Resolver is migrated and newRecordhash is set. Enjoy!')
                            }}
                            data-tooltip={ 'Ready For Off-chain Use' }
                          >
                            <div 
                              className="material-icons smol"
                              style={{
                                color: 'lightgreen',
                                marginLeft: '5px'
                              }}
                            >
                              gpp_good
                            </div>
                          </button>
                        )}
                        { // Set Badge if Resolver is migrated and no newRecordhash is set
                        ['resolver'].includes(item.type) && resolver === constants.ccip2[0] && !recordhash && (
                          <button 
                            className="button-tiny"
                            onClick={() => { 
                              setHelpModal(true),
                              setIcon('gpp_good'),
                              setColor('orange'),
                              setHelp('Resolver migrated but no Recordhash found. Set it by pressing \'Edit\'')
                            }}
                            data-tooltip={ 'Resolver Migrated But Recordhash Not Set' }
                          >
                            <div 
                              className="material-icons smol"
                              style={{
                                color: 'orange',
                                marginLeft: '5px'
                              }}
                            >
                              gpp_good
                            </div>
                          </button>
                        )}
                        { // Set Badge if Resolver is not migrated
                        ['resolver'].includes(item.type) && resolver !== constants.ccip2[0] && !recordhash && (
                          <button 
                            className="button-tiny"
                            onClick={() => { 
                              setHelpModal(true),
                              setIcon('gpp_maybe'),
                              setColor('orangered'),
                              setHelp(item.help)
                            }}
                            data-tooltip={ 'Resolver Not Migrated' }
                          >
                            <div 
                              className="material-icons smol"
                              style={{
                                color: 'orangered',
                                marginLeft: '5px'
                              }}
                            >
                              gpp_maybe
                            </div>
                          </button>
                        )}
                      </span>
                      <button
                        className="button"
                        disabled={ 
                          !list[item.key].active ||
                          !legit[item.type] ||
                          item.state ||
                          !accountData ||
                          !managers.includes(accountData?.address ? accountData.address : '0x0c0cac01ac0ffeecafe')
                        }
                        style={{
                          alignSelf: 'flex-end',
                          height: '25px',
                          width: 'auto',
                          marginTop: '-3px',
                        }}
                        onClick={() => { 
                          setTrigger(item.key),
                          setMessage(['Waiting for Signature', '']),
                          ['resolver'].includes(item.type) ? setSalt(true) : setUpdate(true), // Prompt password for Resolver; derive S2(K0) for Records
                          ['resolver'].includes(item.type) ? setWrite(false) : setWrite(true), // Trigger write for Records
                          ['resolver'].includes(item.type) ? setStates(prevState => [...prevState, item.type]) : setStates(states) // Update edited keys
                        }}
                        data-tooltip={ item.help }
                      >
                        <div 
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              fontSize: '13px'
                            }}
                          >
                              {item.label}&nbsp;<span className="material-icons smoller">manage_history</span>
                          </div>
                      </button>
                    </div>
                    <input 
                      id={ item.key }
                      key={ item.key }
                      placeholder={ item.value }
                      type='text'
                      disabled={ 
                        !item.editable
                      }
                      style={{ 
                        fontFamily: 'SF Mono',
                        letterSpacing: '-0.5px',
                        fontWeight: '400',
                        fontSize: '14px',
                        width: '100%',
                        wordWrap: 'break-word',
                        textAlign: 'left',
                        marginBottom: '-5px',
                        color: ['resolver'].includes(item.type) ? 'skyblue' : (
                          ['recordhash'].includes(item.type) ? 'rgb(255, 255, 255, 0.60)' : 'rgb(255, 255, 255, 0.75)'
                          ),
                        cursor: 'copy'
                      }}
                      onChange={(e) => {
                        setValues(item.type, e.target.value)
                      }}
                    />
                  </div>
                  <hr style={{ marginTop: '5px' }}></hr>
                </li>
              ))}
            </ul>
            <div id="modal-inner">
              <Gas
                color={ 'lightgreen' }
                _ENS_={ 'check_circle_outline' }
                onClose={() => setGasModal(false)}
                show={gasModal}
              >
                { gas }
              </Gas>
              <Salt
                handleTrigger={handleTrigger}
                handleModalData={handleModalData}
                onClose={() => setSalt(false)}
                show={salt}
              >
              </Salt>
            </div>
          </StyledModalBody>
        }
      </StyledModal>
    </StyledModalOverlay>
  ) : null;

  if (browser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById("modal")!
    );
  } else {
    return null;
  }
};

const StyledModalBody = styled.div`
  padding-top: 20px;
  padding-left: 0px;
  padding-right: 0px;
  padding-bottom: 0px;
  display: flex;
  justify-content: center;
  height: auto;
  overflow-y: auto;
  overflow-x: hidden;
`;

const StyledModalTitle = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 22px;
  display: flex;
  justify-content: center;
  font-weight: 1200;
  margin-bottom: 0px;
  color: white;
`;

const StyledModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 20px;
`;

const StyledModal = styled.div`
  width: auto;
  min-width: 400px;
  border-radius: 6px;
  padding-top: 0px;
  padding-left: 0px;
  padding-right: 8px;
  padding-bottom: 0px;
  overflow-y: initial !important
`;

const StyledModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.15);
`;

export default Preview;
