import React from 'react';
import './IOPanel.css';

interface IOAssignment {
  type: 'input' | 'output';
  address: string;
  label: string;
}

interface IOPanelProps {
  ioAssignment: IOAssignment[];
  inputs: Record<string, boolean>;
  outputs: Record<string, boolean>;
  onInputChange?: (address: string, value: boolean) => void;
}

const IOPanel: React.FC<IOPanelProps> = ({
  ioAssignment,
  inputs,
  outputs,
  onInputChange,
}) => {
  const inputs_list = ioAssignment.filter((io) => io.type === 'input');
  const outputs_list = ioAssignment.filter((io) => io.type === 'output');

  const toggleInput = (address: string) => {
    if (onInputChange) {
      onInputChange(address, !inputs[address]);
    }
  };

  return (
    <div className="io-panel">
      <div className="io-section">
        <h4>Inputs</h4>
        <div className="io-list">
          {inputs_list.map((io) => (
            <div
              key={io.address}
              className={`io-item ${inputs[io.address] ? 'active' : ''}`}
              onClick={() => toggleInput(io.address)}
            >
              <div className="io-indicator">
                {inputs[io.address] ? '●' : '○'}
              </div>
              <div className="io-info">
                <div className="io-address">{io.address}</div>
                <div className="io-label">{io.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="io-section">
        <h4>Outputs</h4>
        <div className="io-list">
          {outputs_list.map((io) => (
            <div
              key={io.address}
              className={`io-item ${outputs[io.address] ? 'active' : ''}`}
            >
              <div className="io-indicator">
                {outputs[io.address] ? '●' : '○'}
              </div>
              <div className="io-info">
                <div className="io-address">{io.address}</div>
                <div className="io-label">{io.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IOPanel;
