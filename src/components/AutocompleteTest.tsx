import React, { useState, useEffect } from 'react';
import { addressAutocompleteService } from '../services/addressAutocompleteService';

const AutocompleteTest: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length >= 2) {
      setLoading(true);
      addressAutocompleteService.getSuggestions(query)
        .then(results => {
          console.log('Test component received:', results);
          setSuggestions(results);
          setLoading(false);
        })
        .catch(error => {
          console.error('Test component error:', error);
          setLoading(false);
        });
    } else {
      setSuggestions([]);
    }
  }, [query]);

  return (
    <div style={{ padding: '20px', backgroundColor: 'white', margin: '20px' }}>
      <h3>Autocomplete Test</h3>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type an address..."
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      {loading && <div>Loading...</div>}
      <div>
        <h4>Suggestions ({suggestions.length}):</h4>
        {suggestions.map((suggestion, index) => (
          <div key={index} style={{ padding: '5px', border: '1px solid #ccc', margin: '2px' }}>
            <strong>{suggestion.displayName}</strong>
            <br />
            Type: {suggestion.type}
            <br />
            Confidence: {suggestion.confidence}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutocompleteTest;
