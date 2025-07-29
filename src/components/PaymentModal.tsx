import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, CreditCard, Cigarette, ArrowRight, Wallet } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { supabase } from '../lib/supabase'
import { sendOrderToBot } from '../lib/telegram'

interface PaymentModalProps {
  onClose: () => void
  selectedAddress: any
  isProcessing: boolean
  setIsProcessing: (processing: boolean) => void
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ 
  onClose, 
  selectedAddress, 
  isProcessing, 
  setIsProcessing 
}) => {
  const { state, dispatch } = useApp()
  const { cart, user, userJoints } = state
  const [useJoints, setUseJoints] = useState(false)
  const [jointsToUse, setJointsToUse] = useState(0)

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const delivery = 30
  const total = subtotal + delivery
  const maxJointsToUse = Math.min(userJoints, total)
  const finalAmount = useJoints ? Math.max(0, total - jointsToUse) : total

  const processOrder = async (payWithJoints: boolean = false) => {
    if (!selectedAddress || cart.length === 0 || !user) return
    
    setIsProcessing(true)
    
    try {
      // Получаем пользователя из базы
      const { data: userRecord, error: userError } = await supabase
        .from('users')
        .select('id, joints')
        .eq('telegram_id', user.id)
        .single()

      if (userError || !userRecord) {
        throw new Error('User not found')
      }

      // Проверяем достаточно ли косяков
      if (payWithJoints && jointsToUse > userRecord.joints) {
        alert('Недостаточно косяков на балансе!')
        return
      }

      // Создаем заказ
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userRecord.id,
          total_amount: finalAmount,
          status: 'pending',
          address_id: selectedAddress.id
        })
        .select()
        .single()

      if (orderError || !order) {
        throw new Error('Failed to create order')
      }

      // Добавляем товары в заказ
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        throw new Error('Failed to add order items')
      }

      // Обновляем косяки пользователя
      const jointsEarned = Math.floor(total * 0.1) // 10% от заказа
      let newJointsBalance = userRecord.joints + jointsEarned

      if (payWithJoints) {
        newJointsBalance -= jointsToUse
      }

      const { error: jointsError } = await supabase
        .from('users')
        .update({ joints: newJointsBalance })
        .eq('id', userRecord.id)

      if (!jointsError) {
        dispatch({ type: 'UPDATE_JOINTS', payload: newJointsBalance })
      }

      // Отправляем заказ в Telegram бот
      const orderData = {
        items: cart.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        })),
        total: total,
        user: user,
        address: {
          text: selectedAddress.address_text,
          lat: selectedAddress.lat,
          lng: selectedAddress.lng
        },
        jointsUsed: payWithJoints ? jointsToUse : undefined,
        finalAmount: finalAmount
      }

      const botSuccess = await sendOrderToBot(orderData)
      
      if (botSuccess) {
        alert(`Заказ успешно оформлен! 🎉\n${payWithJoints ? `Использовано ${jointsToUse} косяков\n` : ''}Получено ${jointsEarned} косяков за заказ!`)
      } else {
        alert(`Заказ успешно оформлен! 🎉\n${payWithJoints ? `Использовано ${jointsToUse} косяков\n` : ''}Получено ${jointsEarned} косяков за заказ!`)
      }
      
      dispatch({ type: 'CLEAR_CART' })
      dispatch({ type: 'SET_SELECTED_ADDRESS', payload: null })
      dispatch({ type: 'SET_TAB', payload: 'shop' })
      onClose()
      
    } catch (error) {
      console.error('Error processing order:', error)
      alert('Не удалось обработать заказ. Попробуйте ещё раз.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 max-w-md w-full border border-gray-700/50 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Оплата заказа</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-700/50 rounded-2xl p-4 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-300">
              <span>Товары ({cart.length})</span>
              <span>{subtotal}₿</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Доставка</span>
              <span>{delivery}₿</span>
            </div>
            <div className="border-t border-gray-600 pt-2 mt-2">
              <div className="flex justify-between text-white font-semibold text-lg">
                <span>Итого</span>
                <span>{total}₿</span>
              </div>
            </div>
          </div>
        </div>

        {/* Joints Payment Option */}
        {userJoints > 0 && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Cigarette className="w-6 h-6 text-green-400" />
                <div>
                  <h3 className="text-white font-semibold">Оплата косяками</h3>
                  <p className="text-gray-400 text-sm">У вас {userJoints} косяков</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useJoints}
                  onChange={(e) => {
                    setUseJoints(e.target.checked)
                    if (e.target.checked) {
                      setJointsToUse(maxJointsToUse)
                    } else {
                      setJointsToUse(0)
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            {useJoints && (
              <div className="space-y-3">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Использовать косяков (макс. {maxJointsToUse})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={maxJointsToUse}
                    value={jointsToUse}
                    onChange={(e) => setJointsToUse(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>0</span>
                    <span className="text-green-400 font-semibold">{jointsToUse} косяков</span>
                    <span>{maxJointsToUse}</span>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">К доплате:</span>
                    <span className="text-white font-semibold">{finalAmount}₿</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Payment Buttons */}
        <div className="space-y-3">
          {useJoints && jointsToUse > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => processOrder(true)}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-green-500/25"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Обрабатываем...</span>
                </>
              ) : (
                <>
                  <Cigarette className="w-5 h-5" />
                  <span>Оплатить {jointsToUse > 0 ? `(${jointsToUse} косяков + ${finalAmount}₿)` : `${finalAmount}₿`}</span>
                </>
              )}
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => processOrder(false)}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/25"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Обрабатываем...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Оплатить картой {total}₿</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Bonus Info */}
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <div className="flex items-center space-x-2">
            <Wallet className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-medium">
              За этот заказ вы получите {Math.floor(total * 0.1)} косяков!
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}