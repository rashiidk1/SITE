import React from 'react'
import { AppProvider, useApp } from './contexts/AppContext'
import { ShopView } from './components/ShopView'
import { CartView } from './components/CartView'
import { AddressView } from './components/AddressView'
import { Navigation } from './components/Navigation'

const AppContent: React.FC = () => {
  const { state } = useApp()
  const { currentTab } = state

  const renderCurrentView = () => {
    switch (currentTab) {
      case 'shop':
        return <ShopView />
      case 'cart':
        return <CartView />
      case 'address':
        return <AddressView />
      default:
        return <ShopView />
    }
  }

  return (
    <div className="pb-20">
      {renderCurrentView()}
      <Navigation />
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App