import Select from 'react-select'

export default function FundSelector({ funds, selected, onChange, maxFunds = 3, placeholder = 'Search and add funds...' }) {
  const options = funds.map(f => ({
    value: f.scheme_code,
    label: f.scheme_name.split(' - ')[0],
    fund: f,
  }))

  const selectedOptions = selected.map(code => options.find(o => o.value === code)).filter(Boolean)

  function handleChange(opts) {
    if (!opts) { onChange([]); return }
    if (opts.length > maxFunds) return
    onChange(opts.map(o => o.value))
  }

  return (
    <Select
      isMulti
      options={options}
      value={selectedOptions}
      onChange={handleChange}
      placeholder={placeholder}
      classNamePrefix="rs"
      noOptionsMessage={() => 'No funds found'}
      isOptionDisabled={() => selectedOptions.length >= maxFunds}
      styles={{
        multiValue: base => ({ ...base, backgroundColor: '#e0e7ff', borderRadius: 6 }),
        multiValueLabel: base => ({ ...base, color: '#4338ca', fontWeight: 600, fontSize: 12 }),
        multiValueRemove: base => ({ ...base, color: '#6366f1', ':hover': { background: '#c7d2fe', color: '#4338ca' } }),
      }}
    />
  )
}
