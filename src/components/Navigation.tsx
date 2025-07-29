import React from 'react'
import { motion } from 'framer-motion'
import { Store, ShoppingCart, MapPin, BarChart3 } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

export const Navigation: React.FC = () => {
  const { state, dispatch } = useApp()
  const { currentTab, cart } = state

  const tabs = [
    { id: 'shop' as const, label: 'Магазин', icon: Store },
    { id: 'cart' as const, label: 'Корзина', icon: ShoppingCart, badge: cart.length },
    { id: 'address' as const, label: 'Адреса', icon: MapPin }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md border-t border-gray-700/50">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = currentTab === tab.id
          
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => dispatch({ type: 'SET_TAB', payload: tab.id })}
              className={`relative flex flex-col items-center p-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-green-500/20 text-green-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="relative">
                <Icon className="w-6 h-6 mb-1" />
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{tab.label}</span>
              
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 w-8 h-1 bg-green-500 rounded-full"
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}