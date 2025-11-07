'use client';

import { useAppStore } from '@/store/appStore';

export default function TextLab() {
  const { inputText, setInputText } = useAppStore();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleClear = () => {
    setInputText('');
  };

  const charCount = inputText.length;
  const maxLength = 200;

  return (
    <div className="mb-8">
      <div className="relative">
        <textarea
          value={inputText}
          onChange={handleChange}
          placeholder="Type or paste your text here..."
          className="w-full p-4 pr-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors resize-none"
          rows={3}
          maxLength={maxLength}
        />
        {inputText && (
          <button
            onClick={handleClear}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Clear text"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <div className="mt-2 flex justify-between items-center text-sm">
        <span className={`${charCount >= maxLength ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
          {charCount} / {maxLength} characters
        </span>
        {inputText && (
          <span className="text-gray-500 dark:text-gray-400">
            {inputText.split(/\s+/).filter(Boolean).length} words
          </span>
        )}
      </div>
    </div>
  );
}
