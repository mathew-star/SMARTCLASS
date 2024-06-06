import React, { useState } from 'react'

function TopicDropdown({options, placeholder, onSelect}) {
    const [selectedOption, setSelectedOption] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
  
    const handleOptionClick = (option) => {
      setSelectedOption(option);
      setIsOpen(false);
      if (onSelect) {
        onSelect(option);
      }
    };
  return (
    <>
      <div className="relative inline-block text-left">
      <div>
        <span className="rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex justify-between w-full rounded-md border border-gray-300 bg-[#4d566e] px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring focus:ring-indigo-300"
            aria-haspopup="true"
            aria-expanded="true"
          >
            {selectedOption ? selectedOption.label : placeholder}
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 12a1 1 0 01-.7-.29l-4-4a1 1 0 111.42-1.42L10 10.59l3.29-3.3a1 1 0 111.42 1.42l-4 4a1 1 0 01-.7.29z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </span>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-[#535f82] ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
          <div className="py-1" role="none">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick(option)}
                className="block px-4 py-2 text-sm text-white w-full text-left hover:bg-blue-500"
                role="menuitem"
                tabIndex="-1"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
    </>
  )
}

export default TopicDropdown
