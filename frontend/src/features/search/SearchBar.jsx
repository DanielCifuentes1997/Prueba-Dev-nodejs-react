import { useState } from 'react'
import { useCrypto } from '../../hooks/useCrypto'

const SearchBar = () => {
  const { cryptos, watchlist, addToWatchlist } = useCrypto()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    if (query.trim() === '') {
      setSearchResults([])
      return
    }
    const results = cryptos.filter(c => 
      c.name.toLowerCase().includes(query.toLowerCase()) || 
      c.symbol.toLowerCase().includes(query.toLowerCase())
    )
    setSearchResults(results)
  }

  const handleAdd = (id) => {
    addToWatchlist(id)
    setSearchQuery('')
    setSearchResults([])
  }

  return (
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
              const added = watchlist.some(w => w.id === res.id)
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
  )
}

export default SearchBar