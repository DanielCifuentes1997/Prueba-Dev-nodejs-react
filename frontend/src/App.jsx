import { useContext } from 'react'
import { CryptoContext } from './context/CryptoContext.jsx'

function App() {
  const { cryptos, watchlist, removeFromWatchlist } = useContext(CryptoContext)

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #ccc' }}>
        <h1>CryptoInvestment Dashboard</h1>
      </header>

      <main>
        <section style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h2>Buscador de Criptomonedas</h2>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Buscar moneda por nombre o símbolo..."
              style={{ padding: '10px', width: '100%', maxWidth: '400px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <button style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
              Buscar
            </button>
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
                <div key={coin.id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ margin: '0 0 10px 0' }}>{coin.name} ({coin.symbol})</h3>
                  <p style={{ margin: '5px 0', fontSize: '24px', fontWeight: 'bold' }}>
                    ${Number(coin.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                  </p>
                  <p style={{ margin: '5px 0', color: coin.percent_change_24h >= 0 ? 'green' : 'red' }}>
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