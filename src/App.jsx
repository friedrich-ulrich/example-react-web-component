import { h } from 'preact';
import { useState } from 'preact/hooks';

/** @jsx h */
export const App = ({ onSend }) => {
  const [v, setV] = useState('');
  const handleChange = e => setV(e.target.value);
  const handleSend = () => onSend && onSend(v);
  return (
    <div>
      <h1>Test</h1>
      <input value={v} onChange={handleChange} />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

App.propTypes = { id: 1, onSend: 1 };
