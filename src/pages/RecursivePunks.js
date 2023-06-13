import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import axios from 'axios';
import './RecursivePunks.css';

const RecursivePunks = () => {
  const [ids, setIds] = useState(Array(6).fill(''));  // Initialize 4 empty strings
  const labels = ['head', 'mouth/beard', 'earring', 'hat', 'eyes', 'nose'];  // Labels for the fields

  const handleDownload = async () => {
    let svgContent = '<svg width="24px" height="24px" xmlns="http://www.w3.org/2000/svg">';
    
    for(let id of ids) {
      if(id === '') continue;  // Skip if the ID field is empty

      svgContent += `<image href="/content/${id}" />`
    }

    svgContent += '</svg>';

    const blob = new Blob([svgContent], {type: "image/svg+xml;charset=utf-8"});
    saveAs(blob, "output.svg");

    setIds(Array(4).fill(''));  // Clear all input fields
  }

  const handleInputChange = (index, event) => {
    const values = [...ids];
    values[index] = event.target.value;
    setIds(values);
  }

  return (
    <div className="center">
        <h1>recursive punks</h1>
      {ids.map((id, idx) => (
        <div key={idx}>
          <label>{labels[idx]}: </label>
          <input 
            type="text" 
            value={id} 
            onChange={(e) => handleInputChange(idx, e)}
            placeholder={`Enter id ${idx + 1} here`}
          />
        </div>
      ))}
      <button onClick={handleDownload}>Download SVG</button>
    </div>
  );
}

export default RecursivePunks;

