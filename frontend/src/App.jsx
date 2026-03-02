import { useContext, useState } from 'react'
import { CryptoContext } from './context/CryptoContext.jsx'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import './App.css'

function App() {
  const { cryptos, watchlist, removeFromWatchlist, addToWatchlist, history } = useContext(CryptoContext)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    const results = cryptos.filter(c => 
      c.name.toLowerCase().includes(query.toLowerCase()) || 
      c.symbol.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleAdd = (id) => {
    addToWatchlist(id);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="dashboard">
      <header className="header">
        <h1>CRYPTOTRACKER PRO</h1>
        <div className="status-tag up">Live Market Data</div>
      </header>

      <section className="search-container">
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search crypto assets..."
          />
          {searchResults.length > 0 && (
            <div className="dropdown-results">
              {searchResults.map(res => {
                const added = watchlist.some(w => w.id === res.id);
                return (
                  <div key={res.id} className="result-row">
                    <span>{res.name} <small>{res.symbol}</small></span>
                    <button disabled={added} onClick={() => handleAdd(res.id)} className="btn-add">
                      {added ? 'Tracked' : '+ Add'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <div className="portfolio-grid">
        {watchlist.map(coin => (
          <article key={coin.id} className="crypto-card">
            <div className="card-top">
              <div className="coin-meta">
                <p className="coin-name">{coin.name}</p>
                <span className="coin-symbol">{coin.symbol} / USD</span>
              </div>
              <div className={`status-tag ${coin.percent_change_24h >= 0 ? 'up' : 'down'}`}>
                {coin.percent_change_24h >= 0 ? '▲' : '▼'} {Math.abs(coin.percent_change_24h).toFixed(2)}%
              </div>
            </div>

            <p className="price-main">${Number(coin.price).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>

            <div className="chart-area">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history[coin.id] || []}>
                  <XAxis dataKey="time" hide />
                  <YAxis domain={['auto', 'auto']} hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#38bdf8' }}
                  />
                  <Line type="monotone" dataKey="price" stroke="#38bdf8" strokeWidth={3} dot={false} animationDuration={400} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <button onClick={() => removeFromWatchlist(coin.id)} className="btn-delete">
              Stop Tracking
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}

export default App