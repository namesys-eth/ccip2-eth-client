import * as C from "../utils/constants";
import { ethers } from "ethers";

export async function verifyRecordhash(
  input: string,
  ccip2Config: any,
  address: string
): Promise<string> {
  // Read Recordhash from CCIP2 Resolver
  const contract = new ethers.Contract(
    ccip2Config.addressOrName,
    ccip2Config.contractInterface,
    C.provider
  );
  const _Recordhash_ = await contract.getRecordhash(
    ethers.utils.namehash(input)
  );
  const _Ownerhash_ = await contract.getRecordhash(
    ethers.utils.hexZeroPad(address, 32).toLowerCase()
  );
  return new Promise<string>((resolve, reject) => {
    if (_Recordhash_) {
      resolve(
        String(_Recordhash_) === "0x"
          ? "0"
          : String(_Recordhash_) === String(_Ownerhash_)
          ? "0"
          : String(_Recordhash_).startsWith("0x6874")
          ? "2"
          : "1"
      );
    } else {
      reject(new Error("Failed to fetch Recordhash"));
    }
  });
}

export async function quickRecordhash(
  input: string,
  ccip2Config: any,
  address: string
): Promise<[string, boolean]> {
  // Read Recordhash from CCIP2 Resolver
  const contract = new ethers.Contract(
    ccip2Config.addressOrName,
    ccip2Config.contractInterface,
    C.provider
  );
  const _Recordhash_ = await contract.getRecordhash(
    ethers.utils.namehash(input)
  );
  const _Ownerhash_ = await contract.getRecordhash(
    ethers.utils.hexZeroPad(address, 32).toLowerCase()
  );
  return new Promise<[string, boolean]>((resolve, reject) => {
    if (_Recordhash_) {
      resolve(
        String(_Recordhash_) === "0x"
          ? ["0x", false]
          : String(_Recordhash_) === String(_Ownerhash_)
          ? [String(_Ownerhash_), false]
          : [String(_Recordhash_), true]
      );
    } else {
      reject(new Error("Failed to fetch Recordhash"));
    }
  });
}

export async function verifyOwnerhash(
  ccip2Config: any,
  address: string
): Promise<string> {
  // Read Ownerhash from CCIP2 Resolver
  const contract = new ethers.Contract(
    ccip2Config.addressOrName,
    ccip2Config.contractInterface,
    C.provider
  );
  const _Ownerhash_ = await contract.getRecordhash(
    ethers.utils.hexZeroPad(address, 32).toLowerCase()
  );
  return new Promise<string>((resolve, reject) => {
    if (_Ownerhash_) {
      resolve(
        String(_Ownerhash_) !== "0x"
          ? String(_Ownerhash_).startsWith("0x6874")
            ? "2"
            : "1"
          : "0"
      );
    } else {
      reject(new Error("Failed to fetch Ownerhash"));
    }
  });
}
