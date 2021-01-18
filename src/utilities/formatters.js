import React from 'react';

// Cell display formatters :: String -> String || React.Node
export const toDollars = (displayText) =>
  '$'.concat(Number(Number(displayText).toFixed(2)).toLocaleString('en'));
export const toPercent = (displayText) => String(displayText).concat('%');

export const getHighlightedTextFormatter = (highlight) => {
  const highlightRegExp = new RegExp(`(${highlight})`, 'gi');
  return (text) => {
    const parts = String(text).split(highlightRegExp);
    return (
      <>
        {parts.map((part, i) =>
          i % 2 === 1 ? (
            <mark key={i}>{part}</mark>
          ) : (
            <React.Fragment key={i}>{part}</React.Fragment>
          )
        )}
      </>
    );
  };
};
