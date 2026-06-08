import Select from 'react-select'

const darkStyles = {
  control: (base, state) => ({
    ...base,
    background: '#16130d',
    border: `1px solid ${state.isFocused ? '#e0aa3e' : '#25211a'}`,
    borderRadius: 10,
    minHeight: 44,
    boxShadow: state.isFocused ? '0 0 0 1px #e0aa3e' : 'none',
    '&:hover': { borderColor: '#3a352c' },
  }),
  menu: base => ({ ...base, background: '#1a1610', border: '1px solid #25211a', borderRadius: 12, zIndex: 50 }),
  menuList: base => ({ ...base, padding: 4 }),
  option: (base, state) => ({
    ...base,
    background: state.isSelected ? 'rgba(224,170,62,.15)' : state.isFocused ? 'rgba(224,170,62,.07)' : 'transparent',
    color: state.isSelected ? '#e0aa3e' : '#c9c2b4',
    borderRadius: 8,
    fontSize: 13,
    cursor: 'pointer',
    '&:active': { background: 'rgba(224,170,62,.2)' },
  }),
  multiValue: base => ({ ...base, background: 'rgba(224,170,62,.15)', borderRadius: 6 }),
  multiValueLabel: base => ({ ...base, color: '#e0aa3e', fontWeight: 600, fontSize: 12 }),
  multiValueRemove: base => ({ ...base, color: '#e0aa3e', '&:hover': { background: 'rgba(224,170,62,.25)', color: '#e0aa3e' } }),
  singleValue: base => ({ ...base, color: '#e8e2d4' }),
  input: base => ({ ...base, color: '#e8e2d4' }),
  placeholder: base => ({ ...base, color: '#5a544a' }),
  indicatorSeparator: base => ({ ...base, background: '#25211a' }),
  dropdownIndicator: base => ({ ...base, color: '#5a544a', '&:hover': { color: '#8a8174' } }),
  clearIndicator: base => ({ ...base, color: '#5a544a', '&:hover': { color: '#e7625f' } }),
  noOptionsMessage: base => ({ ...base, color: '#5a544a', fontSize: 13 }),
}

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
      styles={darkStyles}
      noOptionsMessage={() => 'No funds found'}
      isOptionDisabled={() => selectedOptions.length >= maxFunds}
    />
  )
}
