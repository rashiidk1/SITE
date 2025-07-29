import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Plus, Navigation, ArrowRight, Check } from 'lucide-react'
import { useApp } from '../contexts/AppContext'
import { supabase } from '../lib/supabase'
import { sendOrderToBot } from '../lib/telegram'
import { PaymentModal } from './PaymentModal'

interface Address {
  id: string
  title: string
  address_text: string
  lat: number
  lng: number
}

export const AddressView: React.FC = () => {
  const { state, dispatch } = useApp()
  const { addresses, selectedAddress, user, cart, userJoints } = state
  const [showAddForm, setShowAddForm] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isProcessingOrder, setIsProcessingOrder] = useState(false)
  const [newAddress, setNewAddress] = useState({
    title: '',
    address_text: '',
    lat: 13.7563,
    lng: 100.5018
  })

  useEffect(() => {
    loadAddresses()
  }, [user])

  const loadAddresses = async () => {
    if (!user) return

    const { data: userRecord, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('telegram_id', user.id)
      .single()

    if (userError) {
      console.error('Error finding user:', userError)
      return
    }

    if (userRecord) {
      const { data: addressesData, error: addressError } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userRecord.id)

      if (addressError) {
        console.error('Error loading addresses:', addressError)
        return
      }

      if (addressesData) {
        dispatch({ type: 'SET_ADDRESSES', payload: addressesData })
      }
    }
  }

  const saveAddress = async () => {
    if (!user || !newAddress.title || !newAddress.address_text) return

    const { data: userRecord, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('telegram_id', user.id)
      .single()

    if (userError) {
      console.error('Error finding user:', userError)
      return
    }

    if (userRecord) {
      const { data, error } = await supabase
        .from('addresses')
        .insert({
          user_id: userRecord.id,
          title: newAddress.title,
          address_text: newAddress.address_text,
          lat: newAddress.lat,
          lng: newAddress.lng
        })
        .select()
        .single()

      if (error) {
        console.error('Error saving address:', error)
        return
      }

      if (data) {
        dispatch({ type: 'SET_ADDRESSES', payload: [...addresses, data] })
        setShowAddForm(false)
        setNewAddress({ title: '', address_text: '', lat: 13.7563, lng: 100.5018 })
      }
    }
  }

  const selectAddress = (address: Address) => {
    dispatch({ type: 'SET_SELECTED_ADDRESS', payload: address })
  }

  const proceedToPayment = async () => {
    setShowPaymentModal(true)
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setNewAddress(prev => ({
            ...prev,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }))
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-white">Адрес доставки</h1>
          <p className="text-gray-400 mt-1">Куда доставить ваш заказ?</p>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Add Address Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full mb-6 bg-gray-800/50 border-2 border-dashed border-gray-600 hover:border-green-500/50 rounded-2xl p-6 flex items-center justify-center space-x-3 transition-all"
        >
          <Plus className="w-5 h-5 text-green-400" />
          <span className="text-white font-semibold">Добавить новый адрес</span>
        </motion.button>

        {/* Add Address Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Название адреса</label>
                <input
                  type="text"
                  placeholder="Дом, Офис, и т.д."
                  value={newAddress.title}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500/50"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Полный адрес</label>
                <textarea
                  placeholder="Введите полный адрес"
                  value={newAddress.address_text}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, address_text: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500/50 h-24 resize-none"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={getCurrentLocation}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Моё местоположение</span>
                </button>
                
                <button
                  onClick={saveAddress}
                  disabled={!newAddress.title || !newAddress.address_text}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 rounded-xl font-medium"
                >
                  Сохранить адрес
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Saved Addresses */}
        <div className="space-y-4 mb-6">
          {addresses.map((address) => (
            <motion.div
              key={address.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => selectAddress(address)}
              className={`bg-gray-800/50 rounded-2xl p-6 border cursor-pointer transition-all ${
                selectedAddress?.id === address.id
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-gray-700/50 hover:border-gray-600'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl ${
                  selectedAddress?.id === address.id ? 'bg-green-500' : 'bg-gray-700'
                }`}>
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold">{address.title}</h3>
                    {selectedAddress?.id === address.id && (
                      <Check className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{address.address_text}</p>
                  <a
                    href={`https://maps.google.com/?q=${address.lat},${address.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 text-sm hover:underline mt-2 inline-block"
                  >
                    Показать на карте →
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Proceed Button */}
        {selectedAddress && cart.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={proceedToPayment}
            disabled={isProcessingOrder}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-green-500/25"
          >
            <span>Перейти к оплате</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        )}
      </div>
      
      {showPaymentModal && (
        <PaymentModal 
          onClose={() => setShowPaymentModal(false)}
          selectedAddress={selectedAddress}
          isProcessing={isProcessingOrder}
          setIsProcessing={setIsProcessingOrder}
        />
      )}
    </div>
  )
}