'use client';

import { useState } from 'react';

export default function FilterBar({ onFilter }) {
  const [entity, setEntity] = useState('');
  const [minFunding, setMinFunding] = useState('');
  const [search, setSearch] = useState('');

  const handleChange = (field, value) => {
    const newState = { entity, minFunding, search, [field]: value };
    if (field === 'entity') setEntity(value);
    if (field === 'minFunding') setMinFunding(value);
    if (field === 'search') setSearch(value);
    onFilter(newState);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-12 text-text-secondary mb-2 font-medium uppercase tracking-wider">Search</label>
        <input
          type="text"
          value={search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="input-field text-14"
          placeholder="Search schemes..."
        />
      </div>
      <div>
        <label className="block text-12 text-text-secondary mb-2 font-medium uppercase tracking-wider">Entity Type</label>
        <select
          value={entity}
          onChange={(e) => handleChange('entity', e.target.value)}
          className="input-field text-14"
          style={{ cursor: 'pointer' }}
        >
          <option value="">All Types</option>
          <option value="startup">Startup</option>
          <option value="msme">MSME</option>
          <option value="ngo">NGO</option>
        </select>
      </div>
      <div>
        <label className="block text-12 text-text-secondary mb-2 font-medium uppercase tracking-wider">Min Funding</label>
        <select
          value={minFunding}
          onChange={(e) => handleChange('minFunding', e.target.value)}
          className="input-field text-14"
          style={{ cursor: 'pointer' }}
        >
          <option value="">Any Amount</option>
          <option value="100000">₹1L+</option>
          <option value="500000">₹5L+</option>
          <option value="1000000">₹10L+</option>
          <option value="5000000">₹50L+</option>
        </select>
      </div>
    </div>
  );
}
