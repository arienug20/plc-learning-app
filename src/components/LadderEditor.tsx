import React, { useState } from 'react';
import type { LadderElement } from '../store/userStore';
import './LadderEditor.css';

interface LadderEditorProps {
  elements: LadderElement[];
  onChange: (elements: LadderElement[]) => void;
  maxRungs: number;
  readonly?: boolean;
  highlightedRungs?: number[];
}

const ELEMENT_TYPES = [
  { type: 'contact_no', label: 'NO', description: 'Normally Open' },
  { type: 'contact_nc', label: 'NC', description: 'Normally Closed' },
  { type: 'coil', label: '( )', description: 'Coil' },
  { type: 'timer_ton', label: 'TON', description: 'Timer On Delay' },
  { type: 'timer_tof', label: 'TOF', description: 'Timer Off Delay' },
  { type: 'counter_ctu', label: 'CTU', description: 'Counter Up' },
] as const;

const LadderEditor: React.FC<LadderEditorProps> = ({
  elements,
  onChange,
  maxRungs,
  readonly = false,
  highlightedRungs = [],
}) => {
  const [selectedRung, setSelectedRung] = useState(0);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedAddress, setSelectedAddress] = useState('');

  const rungs = Array.from({ length: maxRungs }, (_, i) =>
    elements.filter((el) => el.rung === i)
  );

  const addElement = () => {
    if (!selectedType || !selectedAddress || readonly) return;
    const rungElements = elements.filter((el) => el.rung === selectedRung);
    const newElement: LadderElement = {
      type: selectedType as LadderElement['type'],
      address: selectedAddress,
      rung: selectedRung,
      position: rungElements.length,
    };
    onChange([...elements, newElement]);
    setSelectedType('');
    setSelectedAddress('');
  };

  const removeElement = (rung: number, position: number) => {
    if (readonly) return;
    onChange(
      elements.filter(
        (el) => !(el.rung === rung && el.position === position)
      )
    );
  };

  const clearRung = (rung: number) => {
    if (readonly) return;
    onChange(elements.filter((el) => el.rung !== rung));
  };

  const renderElement = (el: LadderElement) => {
    const isHighlighted = highlightedRungs.includes(el.rung);
    return (
      <div
        key={`${el.rung}-${el.position}`}
        className={`ladder-element ${isHighlighted ? 'highlighted' : ''}`}
      >
        <span className="element-type">{el.type.replace('_', ' ').toUpperCase()}</span>
        <span className="element-address">{el.address}</span>
        {!readonly && (
          <button
            className="remove-btn"
            onClick={() => removeElement(el.rung, el.position)}
          >
            ×
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="ladder-editor">
      <div className="ladder-rungs">
        {rungs.map((rungElements, rungIndex) => (
          <div
            key={rungIndex}
            className={`ladder-rung ${highlightedRungs.includes(rungIndex) ? 'energized' : ''}`}
          >
            <div className="rung-label">Rung {rungIndex}</div>
            <div className="rung-power-left">├</div>
            <div className="rung-elements">
              {rungElements.length === 0 ? (
                <span className="empty-rung">—</span>
              ) : (
                rungElements.map((el) => renderElement(el))
              )}
            </div>
            <div className="rung-power-right">┤</div>
            {!readonly && (
              <button
                className="clear-rung-btn"
                onClick={() => clearRung(rungIndex)}
              >
                Clear
              </button>
            )}
          </div>
        ))}
      </div>

      {!readonly && (
        <div className="element-palette">
          <h4>Tambah Elemen</h4>
          <div className="palette-controls">
            <select
              value={selectedRung}
              onChange={(e) => setSelectedRung(Number(e.target.value))}
            >
              {Array.from({ length: maxRungs }, (_, i) => (
                <option key={i} value={i}>
                  Rung {i}
                </option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">Pilih Tipe</option>
              {ELEMENT_TYPES.map((et) => (
                <option key={et.type} value={et.type}>
                  {et.label} - {et.description}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Address (I0.0, Q0.0, T0, C0)"
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
            />
            <button onClick={addElement} disabled={!selectedType || !selectedAddress}>
              Tambah
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LadderEditor;
