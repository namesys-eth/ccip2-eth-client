import * as ed25519latest from 'ed25519-2.0.0' // @noble/ed25519 v2.0.0
import * as ed25519legacy from 'ed25519-1.6.1' // @noble/ed25519 v1.6.1
import { hkdf } from '@noble/hashes/hkdf'
import { sha256 } from '@noble/hashes/sha256'
import * as secp256k1 from '@noble/secp256k1'
import * as cryptico from 'cryptico-js/dist/cryptico.browser.js'

var _fetch: any

try {
  _fetch = fetch
} catch { }

export function useFetchImplementation(fetchImplementation: any) {
  _fetch = fetchImplementation
}

/**
 * @param  username key identifier
 * @param    caip10 CAIP identifier for the blockchain account
 * @param signature Deterministic signature from X-wallet provider
 * @param  password Optional password
 * @returns Deterministic private/public keypairs as hex strings
 * Hex-encoded
 * [  ed25519.priv,   ed25519.pub], 
 * [secp256k1.priv, secp256k1.pub]
 */
export async function KEYGEN(
  username: string,
  caip10: string,
  signature: string,
  password: string | undefined
): Promise<[
  [string, string],
  [string, string]
]> {
  if (signature.length < 64)
    throw new Error('SIGNATURE TOO SHORT; LENGTH SHOULD BE 65 BYTES')
  let inputKey = sha256(
    ed25519latest.etc.hexToBytes(
      signature.toLowerCase().startsWith('0x') ? signature.slice(2) : signature
    )
  )
  let info = `${caip10}:${username}`
  let salt = sha256(`${info}:${password ? password : ''}:${signature.slice(-64)}`)
  let hashKey = hkdf(sha256, inputKey, salt, info, 42)
  let ed25519priv = ed25519legacy.utils.hashToPrivateScalar(hashKey).toString(16).padStart(64, "0") // ed25519 (IPNS) Private Key
  let ed25519pub = ed25519latest.etc.bytesToHex(await ed25519legacy.getPublicKey(ed25519priv)) // ed25519 (IPNS) Public Key
  let secp256k1priv = secp256k1.utils.bytesToHex(secp256k1.utils.hashToPrivateKey(hashKey)) // secp256k1 Private Key
  let secp256k1pub = secp256k1.utils.bytesToHex(secp256k1.getPublicKey(ed25519priv)) // secp256k1 Public Key
  return [ // Hex-encoded [[ed25519.priv, ed25519.pub], [secp256k1.priv, secp256k1.pub]]
    [ed25519priv, ed25519pub],
    [secp256k1priv, secp256k1pub]
  ] 
}

/**
 * @param  username key identifier
 * @param    caip10 CAIP identifier for the blockchain account
 * @param signature Deterministic signature from X-wallet provider
 * @param  password Optional password
 * @returns Deterministic private/public keypair
 * [RSA.priv, RSA.pub]
 */
export async function RSAGEN(
  username: string,
  caip10: string,
  signature: string,
  password: string | undefined
): Promise<
  [any, string]
> {
  if (signature.length < 64)
    throw new Error('SIGNATURE TOO SHORT; LENGTH SHOULD BE 65 BYTES')
  let inputKey = sha256(
    ed25519latest.etc.hexToBytes(
      signature.toLowerCase().startsWith('0x') ? signature.slice(2) : signature
    )
  )
  let BITS = 2048
  let info = `${caip10}:${username}`
  let salt = sha256(`${info}:${password ? password : ''}:${signature.slice(-64)}`)
  let hashKey = hkdf(sha256, inputKey, salt, info, 42)
  let privKey = cryptico.generateRSAKey(hashKey, BITS)
  let pubKey = cryptico.publicKeyString(privKey)
  return [privKey, pubKey] // [RSA.priv, RSA.pub]
}