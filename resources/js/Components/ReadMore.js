import React, { useState } from 'react';

export default function ReadMore({ children }) {
  const text = children;
  const regextag = /(@[a-z0-9]*)/gi;
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  return (
    <>
      {
        text ? (text.length > 100 ? (isReadMore ? 
          <p className="text-sm" dangerouslySetInnerHTML=
          {{ __html: text.replace(regextag,'<span class = "text-blue-600 font-bold everyone">$1</span>').slice(0,75) }}/> 
          : 
          <p className="text-sm" dangerouslySetInnerHTML=
          {{ __html: text.replace(regextag,'<span class = "text-blue-600 font-bold everyone">$1</span>') }} />) 
          : 
          <p className="text-sm" dangerouslySetInnerHTML=
          {{ __html: text.replace(regextag,'<span class = "text-blue-600 font-bold everyone">$1</span>') }} />) 
          : <br />
      }
      {text && text.length > 100 && (
        <span
          className="font-semibold text-blue-600 rounded-lg  hover:text-yellow-600 cursor-pointer read-or-hide"
          onClick={toggleReadMore}
          onKeyPress={toggleReadMore}
          role="button"
          tabIndex="0"
        >
          {isReadMore ? '... More' : ''}
        </span>
      )}
    </>
  );
}
