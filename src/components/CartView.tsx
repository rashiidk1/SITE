import React from 'react'
import { motion } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

export const CartView: React.FC = () => {
  const { state, dispatch } = useApp()
  const { cart } = state

  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId, quantity } })
  }

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId })
  }

  const proceedToAddress = () => {
    dispatch({ type: 'SET_TAB', payload: 'address' })
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-20 h-20 text-gray-600 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-white mb-2">Корзина пуста</h3>
          <p className="text-gray-400 mb-6">Добавьте товары для начала</p>
          <button
            onClick={() => dispatch({ type: 'SET_TAB', payload: 'shop' })}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Начать покупки
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Корзина</h1>
            <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg">
              {cart.length} товаров
            </div>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="px-4 py-6 space-y-4">
        {cart.map((item) => (
          <motion.div
            key={item.product.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50"
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.product.image_url || 'https://images.pexels.com/photos/1153369/pexels-photo-1153369.jpeg?auto=compress&cs=tinysrgb&w=400'}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded-xl"
              />
              
              <div className="flex-1">
                <h3 className="text-white font-semibold">{item.product.name}</h3>
                <p className="text-gray-400 text-sm">{item.product.category}</p>
                <p className="text-green-400 font-bold">{item.product.price}₿</p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center bg-gray-700 rounded-xl">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="p-2 hover:bg-gray-600 rounded-l-xl transition-colors"
                  >
                    <Minus className="w-4 h-4 text-white" />
                  </button>
                  <span className="px-4 py-2 text-white font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="p-2 hover:bg-gray-600 rounded-r-xl transition-colors"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.product.id)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Checkout */}
      <div className="sticky bottom-20 mx-4 bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-400">Доставка</span>
          <span className="text-white">30₿</span>
        </div>
        <div className="flex items-center justify-between mb-6">
          <span className="text-xl font-bold text-white">Итого</span>
          <span className="text-2xl font-bold text-green-400">{total + 30}₿</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={proceedToAddress}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-green-500/25"
        >
          <span>Выбрать адрес доставки</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  )
}