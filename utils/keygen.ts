import * as ed25519_2 from 'ed25519-2.0.0'
import * as ed25519_1 from 'ed25519-1.6.1'
import { hkdf } from '@noble/hashes/hkdf'
import { sha256 } from '@noble/hashes/sha256'

var _fetch: any

try {
  _fetch = fetch
} catch {}

export function useFetchImplementation(fetchImplementation: any) {
  _fetch = fetchImplementation
}

function bigintToUint8Array(n: bigint): Uint8Array {
  const hex = n.toString(16).padStart(64, '0');
  return new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
}

function Stringify(arg: any) {
  return JSON.parse(JSON.stringify(arg, (key, value) =>
      typeof value === 'bigint'
          ? value.toString()
          : value // return everything else unchanged
  ));
}

/**
 *
 * @param username key identifier
 * @param caip10 CAIP identifier for the blockchain account
 * @param sig Deterministic signature from X-wallet provider
 * @param password Optional password
 * @returns Deterministic private key as hex string
 */
export async function ed25519Keygen(
  username: string,
  caip10: string,
  sig: string,
  password: string | undefined
): Promise<[string, string]> {
  if (sig.length < 64)
    throw new Error('Signature too short; length should be 65 bytes')
  let inputKey = sha256(
    ed25519_2.etc.hexToBytes(
      sig.toLowerCase().startsWith('0x') ? sig.slice(2) : sig
    )
  )
  let info = `${caip10}:${username}`
  let salt = sha256(`${info}:${password ? password : ''}:${sig.slice(-64)}`)
  let hashKey = hkdf(sha256, inputKey, salt, info, 42)
  let privateKey = ed25519_1.utils.hashToPrivateScalar(hashKey).toString(16).padStart(64, "0")
  let publicKey = ed25519_2.etc.bytesToHex(await ed25519_1.getPublicKey(privateKey))
  return [privateKey, publicKey]
}
