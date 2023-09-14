import { TWorkerMess } from '../../typings/worker'
import { RSAGEN } from '../../utils/keygen'
// RSA key serialisation
const onmessage = (event: MessageEvent<TWorkerMess>) => {
  const variables = event.data
  const keygen = async () => {
    let _keypair = await RSAGEN(
      variables._origin, 
      variables._caip10, 
      variables._sigRSA, 
      variables._salt
    )
    postMessage(_keypair)
  }
  keygen()
}

addEventListener('message', onmessage)
