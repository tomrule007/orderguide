import React from 'react';
import AppBar from './features/appBar/AppBar';
import AppDrawer from './features/appDrawer/AppDrawer';
import OrderGuide from './features/orderGuide/OrderGuide';

function App() {
  return (
    <>
      <AppBar />
      <AppDrawer />
      <OrderGuide />
    </>
  );
}

export default App;
