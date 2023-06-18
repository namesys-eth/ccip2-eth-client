import * as constants from '../utils/constants'
import { ethers } from 'ethers'

const contract = new ethers.Contract(constants.ccip2Config[0].addressOrName, constants.ccip2Config[0].contractInterface, constants.provider)

export async function verifyRecordhash(input: string): Promise<boolean> {
  // Read Recordhash from CCIP2 Resolver
  const _Recordhash_ = await contract.recordhash(ethers.utils.namehash(input))
  return new Promise<boolean>((resolve, reject) => {
    if (_Recordhash_) {
      resolve(_Recordhash_.toString() !== '0x' ? true : false)
    } else {
      reject(new Error('Failed to fetch Recordhash'))
    }
  })
}
