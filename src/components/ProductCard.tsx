import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Star } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  category: string | null
  stock: number
}

interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { dispatch } = useApp()

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: product })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 hover:border-green-500/30 transition-all duration-300"
    >
      <div className="relative">
        <img
          src={product.image_url || 'https://images.pexels.com/photos/1153369/pexels-photo-1153369.jpeg?auto=compress&cs=tinysrgb&w=400'}
          alt={product.name}
          className="w-full h-48 object-cover rounded-xl mb-4"
        />
        {product.category && (
          <span className="absolute top-2 left-2 bg-green-500/20 text-green-400 px-2 py-1 rounded-lg text-xs font-medium">
            {product.category}
          </span>
        )}
        <div className="absolute top-2 right-2 flex items-center bg-black/50 rounded-lg px-2 py-1">
          <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
          <span className="text-xs text-white">4.8</span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-white font-semibold text-lg mb-1">{product.name}</h3>
          {product.description && (
            <p className="text-gray-400 text-sm line-clamp-2">{product.description}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">{product.price}₿</span>
            <span className="text-xs text-gray-500">за штуку</span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white p-3 rounded-xl shadow-lg shadow-green-500/25 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}