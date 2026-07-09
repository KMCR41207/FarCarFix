import React, { useState, useRef, useEffect } from 'react';

interface AutocompleteProps {
  suggestions: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function Autocomplete({
  suggestions,
  value,
  onChange,
  placeholder = '',
  label = '',
}: AutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!value) {
      setFilteredSuggestions([]);
      return;
    }

    const filtered = suggestions
      .filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      )
      .slice(0, 5); // Limit to 5 suggestions

    setFilteredSuggestions(filtered);
    setIsOpen(filtered.length > 0);
  }, [value, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    outline: 'none',
    fontSize: '0.95rem',
    transition: 'border-color 0.2s',
    background: '#fff',
    color: '#0a0a0a',
  } as React.CSSProperties;

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: '0.875rem',
            marginBottom: '8px',
            color: '#6b7280',
          }}
        >
          {label}
        </label>
      )}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          if (filteredSuggestions.length > 0) {
            setIsOpen(true);
          }
        }}
        style={inputStyle}
        onMouseEnter={(e) =>
          ((e.target as HTMLInputElement).style.borderColor = '#0EA5E9')
        }
        onMouseLeave={(e) =>
          ((e.target as HTMLInputElement).style.borderColor = '#d1d5db')
        }
      />

      {isOpen && filteredSuggestions.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            marginTop: '4px',
            zIndex: 10,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {filteredSuggestions.map((suggestion, idx) => (
            <div
              key={idx}
              onClick={() => {
                onChange(suggestion);
                setIsOpen(false);
              }}
              style={{
                padding: '10px 16px',
                borderBottom:
                  idx < filteredSuggestions.length - 1
                    ? '1px solid #f3f4f6'
                    : 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                fontSize: '0.9rem',
                color: '#0a0a0a',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget.style.backgroundColor = '#f3f4f6'))
              }
              onMouseLeave={(e) =>
                ((e.currentTarget.style.backgroundColor = 'transparent'))
              }
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
