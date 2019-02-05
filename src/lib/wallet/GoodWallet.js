// @flow
import type Web3 from 'web3'
import WalletFactory from './WalletFactory'
import IdentityABI from '@gooddollar/goodcontracts/build/contracts/Identity.json'
import RedemptionABI from '@gooddollar/goodcontracts/build/contracts/RedemptionFunctional.json'
import GoodDollarABI from '@gooddollar/goodcontracts/build/contracts/GoodDollar.json'
import ReserveABI from '@gooddollar/goodcontracts/build/contracts/GoodDollarReserve.json'
import logger from '../../lib/logger/pino-logger'

const log = logger.child({ from: 'GoodWallet' })

export class GoodWallet {
  ready: Promise<Web3>
  wallet: Web3
  accountsContract: Web3.eth.Contract
  tokenContract: Web3.eth.Contract
  identityContract: Web3.eth.Contract
  claimContract: Web3.eth.Contract
  reserveContract: Web3.eth.Contract
  account: string
  networkId: number

  constructor() {
    this.ready = WalletFactory.create('software')
    this.ready.then(wallet => {
      this.wallet = wallet
      this.account = this.wallet.eth.defaultAccount
      this.networkId = 42
      this.identityContract = new this.wallet.eth.Contract(
        IdentityABI.abi,
        IdentityABI.networks[this.networkId].address,
        { from: this.account }
      )
      this.claimContract = new this.wallet.eth.Contract(
        RedemptionABI.abi,
        RedemptionABI.networks[this.networkId].address,
        { from: this.account }
      )
      this.tokenContract = new this.wallet.eth.Contract(
        GoodDollarABI.abi,
        GoodDollarABI.networks[this.networkId].address,
        { from: this.account }
      )
      this.reserveContract = new this.wallet.eth.Contract(ReserveABI.abi, ReserveABI.networks[this.networkId].address, {
        from: this.account
      })
    })
  }

  async claim() {
    await this.ready
    await this.claimContract.methods.claimTokens().call()
  }

  async checkEntitlement() {
    await this.ready
    return await this.claimContract.methods.checkEntitlement().call()
  }

  // balanceChanged(callback:(error,event) => any) {
  //   let handler = this.tokenContract.events.Transfer({fromBlock:'latest',filter:{'from':this.addr}},callback)
  //   let handler2 = this.tokenContract.events.Transfer({fromBlock:'latest',filter:{'to':this.addr}},callback)
  //   return [handler,handler2]
  // }
  //
  signMessage() {}

  sendTx() {}

  async sign(toSign: string) {
    await this.ready
    return this.wallet.eth.sign(toSign, this.account)
  }

  async isVerified(address: string): Promise<boolean> {
    await this.ready
    const tx: boolean = await this.identityContract.methods.isVerified(address).call()
    return tx
  }

  async isCitizen(): Promise<boolean> {
    await this.ready
    const tx: boolean = await this.identityContract.methods.isVerified(this.account).call()
    return tx
  }
}
export default new GoodWallet()
