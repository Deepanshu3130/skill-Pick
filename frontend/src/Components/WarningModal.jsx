import React from 'react'

function WarningModal({onClose}) {
  return (
    <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="bg-base-100 rounded-lg p-6 max-w-md w-full">
      <h3 className="text-xl font-bold mb-4">Search Tips</h3>
      <ul className="list-disc pl-5 space-y-2 mb-6">
        <li>Search using exact skill names (e.g. "web development", "AutoCAD")</li>
        <li>Avoid abbreviations and shortcuts</li>
        <li>Use lowercase letters for best results</li>
        <li>Searches for new skills may take 30-40 seconds</li>
      </ul>
      <div className="text-sm text-error mb-4">
        We apologize for any inconvenience as we're still improving our functionality
      </div>
      <div className="flex justify-end">
        <button 
          onClick={() => onClose(false)}
          className="btn btn-primary"
        >
          I Understand
        </button>
      </div>
    </div>
  </div>
);
}

export default WarningModal