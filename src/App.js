import React from 'react';
import AppBar from './features/appBar/AppBar';
import AppDrawer from './features/appDrawer/AppDrawer';
import OrderGuide from './features/orderGuide/OrderGuide';
import FileLoader from './features/fileLoader/FileLoader';
function App() {
  return (
    <>
      <AppBar />
      <AppDrawer />
      <FileLoader />
      <OrderGuide />
    </>
  );
}

export default App;
