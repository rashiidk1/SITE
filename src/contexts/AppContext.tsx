import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { initTelegram, TelegramUser } from '../lib/telegram'

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  category: string | null
  stock: number
}

interface CartItem {
  product: Product
  quantity: number
}

interface Address {
  id: string
  title: string
  address_text: string
  lat: number
  lng: number
}

interface AppState {
  user: TelegramUser | null
  isAuthenticated: boolean
  userJoints: number
  products: Product[]
  cart: CartItem[]
  addresses: Address[]
  selectedAddress: Address | null
  loading: boolean
  currentTab: 'shop' | 'cart' | 'address'
  error: string | null
  searchQuery: string | null
  showJointsModal: boolean
}

type AppAction =
  | { type: 'SET_USER'; payload: TelegramUser | null }
  | { type: 'SET_USER_JOINTS'; payload: number }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_ADDRESSES'; payload: Address[] }
  | { type: 'SET_SELECTED_ADDRESS'; payload: Address | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TAB'; payload: AppState['currentTab'] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SHOW_JOINTS_MODAL'; payload: boolean }
  | { type: 'UPDATE_JOINTS'; payload: number }

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  userJoints: 247,
  products: [],
  cart: [],
  addresses: [],
  selectedAddress: null,
  loading: true,
  currentTab: 'shop',
  error: null,
  searchQuery: null,
  showJointsModal: false
}

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload }
    case 'SET_USER_JOINTS':
      return { ...state, userJoints: action.payload }
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload }
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.product.id === action.payload.id)
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
      }
      return { ...state, cart: [...state.cart, { product: action.payload, quantity: 1 }] }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.product.id !== action.payload) }
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0)
      }
    case 'CLEAR_CART':
      return { ...state, cart: [] }
    case 'SET_ADDRESSES':
      return { ...state, addresses: action.payload }
    case 'SET_SELECTED_ADDRESS':
      return { ...state, selectedAddress: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_TAB':
      return { ...state, currentTab: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload }
    case 'SET_SHOW_JOINTS_MODAL':
      return { ...state, showJointsModal: action.payload }
    case 'UPDATE_JOINTS':
      return { ...state, userJoints: action.payload }
    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  useEffect(() => {
    const initApp = async () => {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      
      try {
        // Initialize Telegram
        const { isAvailable, user } = initTelegram()
        
        if (isAvailable && user) {
          dispatch({ type: 'SET_USER', payload: user })
          
          // Save/update user in database
          const { error: userError } = await supabase
            .from('users')
            .upsert({
              telegram_id: user.id,
              username: user.username,
              first_name: user.first_name,
              last_name: user.last_name
            }, {
              onConflict: 'telegram_id'
            })
          
          if (userError) {
            console.error('Error saving user:', userError)
          } else {
            // Загружаем количество косяков пользователя
            const { data: userData, error: jointsError } = await supabase
              .from('users')
              .select('joints')
              .eq('telegram_id', user.id)
              .single()
            
            if (!jointsError && userData) {
              dispatch({ type: 'SET_USER_JOINTS', payload: userData.joints || 247 })
            }
          }
        }
        
        // Load products
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (productsError) {
          console.error('Error loading products:', productsError)
        dispatch({ type: 'SET_ERROR', payload: 'Не удалось загрузить товары' })
        } else if (products) {
          dispatch({ type: 'SET_PRODUCTS', payload: products })
        }
      } catch (error) {
        console.error('Error initializing app:', error)
        dispatch({ type: 'SET_ERROR', payload: 'Не удалось инициализировать приложение' })
      }
      
      dispatch({ type: 'SET_ERROR', payload: 'Не удалось инициализировать приложение' })
    }
    
    initApp()
  }, [])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}