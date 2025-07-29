import React from 'react'
import { motion } from 'framer-motion'
import { X, Cigarette, Gift, ShoppingBag, Coins } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

export const JointsModal: React.FC = () => {
  const { state, dispatch } = useApp()
  const { userJoints } = state

  const closeModal = () => {
    dispatch({ type: 'SET_SHOW_JOINTS_MODAL', payload: false })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={closeModal}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 max-w-md w-full border border-gray-700/50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
              <Cigarette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Косяки</h2>
              <p className="text-gray-400 text-sm">Бонусная система</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-2 hover:bg-gray-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Balance */}
        <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-2xl p-6 mb-6 border border-green-500/30">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Cigarette className="w-8 h-8 text-green-400" />
              <span className="text-4xl font-bold text-green-400">{userJoints}</span>
            </div>
            <p className="text-gray-300 font-medium">Ваш баланс косяков</p>
            <p className="text-gray-400 text-sm mt-1">1 косяк = 1₿</p>
          </div>
        </div>

        {/* How it works */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Как это работает:</h3>
          
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="text-white font-medium">Покупайте товары</h4>
              <p className="text-gray-400 text-sm">За каждый заказ вы получаете 10% от суммы в косяках</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Coins className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h4 className="text-white font-medium">Копите косяки</h4>
              <p className="text-gray-400 text-sm">Косяки накапливаются на вашем счету автоматически</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Gift className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h4 className="text-white font-medium">Тратьте на скидки</h4>
              <p className="text-gray-400 text-sm">Используйте косяки для оплаты следующих заказов</p>
            </div>
          </div>
        </div>

        {/* Close button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={closeModal}
          className="w-full mt-8 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-green-500/25"
        >
          Понятно!
        </motion.button>
      </motion.div>
    </motion.div>
  )
}