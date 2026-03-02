import { useCrypto } from '../../hooks/useCrypto'
import PriceHistoryChart from '../charts/PriceHistoryChart'
import StatusTag from '../../components/StatusTag'

const AssetCard = ({ coin }) => {
  const { removeFromWatchlist, history } = useCrypto()
  const isUp = coin.percent_change_24h >= 0

  return (
    <article className="crypto-card">
      <div className="card-top">
        <div className="coin-meta">
          <p className="coin-name">{coin.name}</p>
          <span className="coin-symbol">{coin.symbol} / USD</span>
        </div>
        <StatusTag 
          type={isUp ? 'up' : 'down'} 
          text={`${isUp ? '▲' : '▼'} ${Math.abs(coin.percent_change_24h).toFixed(2)}%`} 
        />
      </div>

      <div className="price-section">
        <p className="price-main">${Number(coin.price).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
        <p className="coin-symbol" style={{marginTop: '-10px', marginBottom: '15px'}}>
          Vol 24h: ${Number(coin.volume_24h).toLocaleString(undefined, {maximumFractionDigits: 0})}
        </p>
      </div>

      <PriceHistoryChart data={history[coin.id]} />

      <button onClick={() => removeFromWatchlist(coin.id)} className="btn-delete">
        Stop Tracking
      </button>
    </article>
  )
}

export default AssetCard