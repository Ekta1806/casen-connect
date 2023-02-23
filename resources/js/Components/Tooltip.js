import React from 'react';

export default function ToolTip({ children }) {

  return (
    <>
      <div className="tooltip">
        {children.slice(0, 20)}
        <span className="tooltiptext">{children}</span>
      </div>
    </>
  );
}
