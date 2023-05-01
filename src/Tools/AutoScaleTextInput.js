import React from 'react'; 
import { useState } from 'react'; 

function AutoScaleTextArea() { 
  
  const [textareaheight, setTextareaheight] = useState(1); 
  
  function handleChange(event) { 
    
    console.log( event.target.rows ) 
    const height = event.target.scrollHeight; 
    const rowHeight = 15; 
    const trows = Math.ceil(height / rowHeight) - 1; 
    
    if (trows == textareaheight) { 
      setTextareaheight(trows); 
    } 
    
  } 
  
  return ( 
    <textarea rows={textareaheight} onChange={handleChange} > </textarea>
  ); 
  
} 

export { AutoScaleTextArea };