import React from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Leaf, Cigarette } from 'lucide-react'
import { ProductCard } from './ProductCard'
import { useApp } from '../contexts/AppContext'
import { JointsModal } from './JointsModal'

export const ShopView: React.FC = () => {
  const { state, dispatch } = useApp()
  const { products, loading, user, searchQuery, userJoints, showJointsModal } = state

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes((searchQuery || '').toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes((searchQuery || '').toLowerCase()))
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Загружаем товары...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white text-xl font-bold">
                  Привет, {user?.first_name || 'друг'}!
                </h1>
                <p className="text-gray-400 text-sm">Готов к покупкам?</p>
              </div>
            </div>
            <button 
              onClick={() => dispatch({ type: 'SET_SHOW_JOINTS_MODAL', payload: true })}
              className="bg-gray-800 hover:bg-gray-700 rounded-xl px-3 py-2 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Cigarette className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-semibold">{userJoints}</span>
                <span className="text-gray-400 text-sm">косяков</span>
              </div>
            </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={searchQuery || ''}
              onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-600 p-2 rounded-xl transition-colors">
              <Filter className="w-4 h-4 text-gray-300" />
            </button>
          </div>

          {/* Categories */}
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {['Популярное', 'Домашние', 'Уличные', 'Семена', 'Аксессуары'].map((category, index) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                  index === 0
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <Leaf className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400">
              {searchQuery ? 'Ничего не найдено' : 'Товары пока отсутствуют'}
            </h3>
            <p className="text-gray-500">
              {searchQuery ? 'Попробуйте изменить запрос' : 'Товары появятся здесь скоро!'}
            </p>
          </div>
        )}
      </div>
      
      {showJointsModal && <JointsModal />}
    </div>
  )
}