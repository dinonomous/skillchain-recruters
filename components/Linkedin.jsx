import React, { useEffect, useState } from 'react'

export const Linkedin = (link) => {

    const [data, setData] = useState(null);

    useEffect(() => {
        
    }, [])
    
async function name (params) => {
    const linkedInUrl = `https%3A%2F%2Fwww.linkedin.com%2Fin%2Fsyeda-umaiza-unsa-29a648287%2F`
    const url = `https://api.scrapin.io/enrichment/profile?apikey=${apiKey}&linkedInUrl=${linkedInUrl}`;
    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }   
}

    return await name;
  return (
    <div className='fixed top-10 left-40 right-40 h-auto'>\
        {data}
    </div>
  )
}
