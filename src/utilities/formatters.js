import React from 'react';

// Cell display formatters :: String -> String -> String || React.Node
export const toDollars = (filterText, displayText) =>
  '$'.concat(Number(displayText).toFixed(2));
export const toPercent = (filterText, displayText) =>
  String(displayText).concat('%');

export const highlightedText = (highlight, text) => {
  const parts = String(text).split(new RegExp(`(${highlight})`, 'gi'));
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
