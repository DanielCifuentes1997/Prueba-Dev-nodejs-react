import SearchBar from './features/search/SearchBar'
import AssetCard from './features/dashboard/AssetCard'
import { useContext } from 'react'
import { CryptoContext } from './context/CryptoContext'
import './App.css'

function App() {
  const { watchlist } = useContext(CryptoContext)

  return (
    <div className="dashboard">
      <header className="header">
        <h1>CRYPTOTRACKER PRO</h1>
        <div className="status-tag up">Live Market Data</div>
      </header>

      <SearchBar />

      <div className="portfolio-grid">
        {watchlist.map(coin => (
          <AssetCard key={coin.id} coin={coin} />
        ))}
      </div>
    </div>
  )
}

export default App