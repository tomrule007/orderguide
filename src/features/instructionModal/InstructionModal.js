import React, { useEffect, useState } from 'react';

const InstructionalModal = () => {
  const [hideInstructions, setHideInstructions] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('hideInstructions')) return;
    setHideInstructions(false);
  });

  const disableInstructionModal = () => {
    localStorage.setItem('hideInstructions', true); //TODO: Handle storage error situations.
    setHideInstructions(true);
  };
  return hideInstructions ? null : (
    <div>
      <p> Welcome to orderguide.netlify.app</p>
      <p>
        This website provides a searchable web interface for the produce
        departments weekly excel spreadsheet price list.
      </p>
      <p>
        If you don't have access to the spreadsheet you can test run the website
        with the included "load mock data" link.
      </p>
      <p>
        Note: this website is also a Progressive web app meaning your browser
        will ask if you would like to add a shortcut to your desktop. This will
        allow the app to run in offline mode and also display in fullscreen
        mode. It will not give the app access to your files and is no less
        secure than visiting a website.
      </p>
      <button onClick={disableInstructionModal}>disable popup</button>
    </div>
  );
};

export default InstructionalModal;
