import { useContext } from 'react'
import { CryptoContext } from '../context/CryptoContext'

export const useCrypto = () => {
  const context = useContext(CryptoContext)
  if (!context) {
    throw new Error('useCrypto debe usarse dentro de un CryptoProvider')
  }
  return context
}