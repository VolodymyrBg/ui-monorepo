export type Account = string
export type Balance = {
  confirmed: number
  total: number
  unconfirmed: number
}
export type BtcSupportedNetworks = 'livenet' | 'testnet'

interface EventMap {
  accountsChanged: (accounts: Account[]) => void
  networkChanged: (network: BtcSupportedNetworks) => void
}

// See https://docs.unisat.io/dev/unisat-developer-center/unisat-wallet#methods
export interface Unisat {
  getAccounts(): Promise<Account[]>
  getBalance(): Promise<Balance>
  getNetwork(): Promise<BtcSupportedNetworks>
  requestAccounts(): Promise<Account[]>
  on<Event extends keyof EventMap>(event: Event, handler: EventMap[Event]): void
  removeListener<Event extends keyof EventMap>(
    event: Event,
    handler: EventMap[Event],
  ): void
  switchNetwork: (network: BtcSupportedNetworks) => Promise<void>
}