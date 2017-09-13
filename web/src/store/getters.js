import { assets } from '/api/assets'
import { isPrivateKey, getAddressFromPrivateKey } from '/api/assets/BTC'
import state from '/store/state'
import { decryptAES128CTR } from '/api/security'

// GETTERS
export function getTotalWallets(wallets) {
    let total = 0
    Object.keys(assets).forEach(crypto=>{
        if (typeof wallets[crypto] == 'object')
            total += Object.keys(wallets[crypto]).length
    })
    return total
}


export function convertBalance(symbol, balance) {
    return state.prices[symbol] * (balance||0)
}

export function getWallet(symbol, address) {
    return state.wallets[symbol][address]
}

export function isWalletRegistered(symbol, address) {
    return (
        state.wallets.hasOwnProperty(symbol) &&
        state.wallets[symbol].hasOwnProperty(address)
    )
}

export function isWalletWithPrivateKey(symbol, address) {
    return (
        isWalletRegistered(symbol, address) &&
        state.wallets[symbol][address].hasOwnProperty('private_key')
    )
}

export function unlockBTCWallet(address, password) {
    const private_key = decryptAES128CTR(
        getWallet(assetsBTC.symbol, address).private_key,
        password
    )

    if ( isPrivateKey(private_key) ) {
        if ( getAddressFromPrivateKey(private_key)===address )
            return private_key
    }

    return false
}


export function getWalletsAsArray() {
    const wallets = []
    let wallet
    Object.keys(state.wallets).forEach(symbol => {
        Object.keys(state.wallets[symbol]).forEach(address => {
            wallet = {
                symbol: symbol,
                address: address,
                wallet: state.wallets[symbol][address]
            }
            wallets.push(wallet)
        })
    })
    return wallets
}