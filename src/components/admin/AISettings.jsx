import { useState } from 'react';

const AISettings = ({ initial, onSave, saving }) => {
  const [model, setModel] = useState(initial?.model || 'llama-3.3-70b-versatile');
  const [temperature, setTemperature] = useState(
    typeof initial?.temperature === 'number' ? initial.temperature : 0.7
  );
  const [maxTokens, setMaxTokens] = useState(initial?.maxTokens || 2048);

  const submit = () => {
    onSave({ model, temperature: Number(temperature), maxTokens: Number(maxTokens) });
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="text-lg font-bold mb-4">AI Settings</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
            Model
          </label>
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
            Temperature
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="2"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
            Max Tokens
          </label>
          <input
            type="number"
            min="256"
            max="8192"
            value={maxTokens}
            onChange={(e) => setMaxTokens(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={submit}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-400 px-4 py-2 rounded font-bold"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default AISettings;

