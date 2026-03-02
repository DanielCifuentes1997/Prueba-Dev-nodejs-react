import { useContext, useState } from 'react'
import { CryptoContext } from './context/CryptoContext.jsx'

function App() {
  const { cryptos, watchlist, removeFromWatchlist, addToWatchlist } = useContext(CryptoContext)
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
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #ccc' }}>
        <h1>CryptoInvestment Dashboard</h1>
      </header>

      <main>
        <section style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h2>Buscador de Criptomonedas</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px', position: 'relative' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Buscar moneda por nombre o símbolo..."
                style={{ padding: '10px', width: '100%', maxWidth: '400px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            
            {searchResults.length > 0 && (
              <div style={{ position: 'absolute', top: '45px', left: '0', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px', width: '100%', maxWidth: '400px', zIndex: 10, maxHeight: '200px', overflowY: 'auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                {searchResults.map(result => {
                  const isInWatchlist = watchlist.some(w => w.id === result.id);
                  return (
                    <div key={result.id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{result.name} ({result.symbol})</span>
                      <button 
                        disabled={isInWatchlist}
                        onClick={() => handleAdd(result.id)}
                        style={{ padding: '5px 10px', backgroundColor: isInWatchlist ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: isInWatchlist ? 'not-allowed' : 'pointer' }}
                      >
                        {isInWatchlist ? 'Agregado' : 'Agregar'}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          <p style={{ fontSize: '14px', color: '#666' }}>Total en catálogo local: {cryptos.length} activos</p>
        </section>

        <section>
          <h2>Mi Portafolio</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '15px' }}>
            {watchlist.length === 0 ? (
              <p>No tienes monedas en seguimiento. Busca y agrega una.</p>
            ) : (
              watchlist.map(coin => (
                <div key={coin.id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
                  <h3 style={{ margin: '0 0 10px 0' }}>{coin.name} ({coin.symbol})</h3>
                  <p style={{ margin: '5px 0', fontSize: '24px', fontWeight: 'bold' }}>
                    ${Number(coin.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                  </p>
                  <p style={{ margin: '5px 0', color: coin.percent_change_24h >= 0 ? 'green' : 'red', fontWeight: 'bold' }}>
                    Variación 24h: {Number(coin.percent_change_24h).toFixed(2)}%
                  </p>
                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#555' }}>
                    Volumen: ${Number(coin.volume_24h).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <button 
                    onClick={() => removeFromWatchlist(coin.id)}
                    style={{ marginTop: '15px', padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
                  >
                    Eliminar del Portafolio
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App