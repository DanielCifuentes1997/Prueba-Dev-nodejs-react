import { useContext, useState } from 'react'
import { CryptoContext } from './context/CryptoContext.jsx'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

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
    const lowerCaseQuery = query.toLowerCase();
    const results = cryptos.filter(crypto => 
      crypto.name.toLowerCase().includes(lowerCaseQuery) || 
      crypto.symbol.toLowerCase().includes(lowerCaseQuery)
    );
    setSearchResults(results);
  };

  const handleAdd = (id) => {
    addToWatchlist(id);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <header style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #007bff' }}>
        <h1 style={{ color: '#333' }}>CryptoInvestment Dashboard</h1>
      </header>

      <main>
        <section style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h2>Buscador de Criptomonedas</h2>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Buscar moneda por nombre o símbolo..."
              style={{ padding: '12px', width: '100%', maxWidth: '400px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            {searchResults.length > 0 && (
              <div style={{ position: 'absolute', top: '50px', left: '0', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px', width: '100%', maxWidth: '400px', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                {searchResults.map(result => {
                  const isInWatchlist = watchlist.some(w => w.id === result.id);
                  return (
                    <div key={result.id} style={{ padding: '12px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{result.name} ({result.symbol})</span>
                      <button 
                        disabled={isInWatchlist}
                        onClick={() => handleAdd(result.id)}
                        style={{ padding: '5px 10px', backgroundColor: isInWatchlist ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        {isInWatchlist ? 'En lista' : 'Agregar'}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        <section>
          <h2>Mi Portafolio (Actualización cada 30s)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px', marginTop: '15px' }}>
            {watchlist.map(coin => (
              <div key={coin.id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ margin: '0' }}>{coin.name}</h3>
                    <small style={{ color: '#888' }}>{coin.symbol}</small>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0', fontSize: '20px', fontWeight: 'bold' }}>${Number(coin.price).toFixed(2)}</p>
                    <p style={{ margin: '0', color: coin.percent_change_24h >= 0 ? '#28a745' : '#dc3545', fontSize: '14px' }}>
                      {coin.percent_change_24h >= 0 ? '▲' : '▼'} {Math.abs(coin.percent_change_24h).toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div style={{ width: '100%', height: '150px', marginTop: '15px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={history[coin.id] || []}>
                      <XAxis dataKey="time" hide />
                      <YAxis domain={['auto', 'auto']} hide />
                      <Tooltip />
                      <Line type="monotone" dataKey="price" stroke="#007bff" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <button 
                  onClick={() => removeFromWatchlist(coin.id)}
                  style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff', color: '#dc3545', border: '1px solid #dc3545', borderRadius: '6px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App