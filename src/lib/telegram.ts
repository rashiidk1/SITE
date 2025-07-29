// Fallback для разработки без Telegram
const mockTelegramUser = {
  id: 123456789,
  first_name: 'Test',
  last_name: 'User',
  username: 'testuser',
  language_code: 'en'
}

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

export const initTelegram = () => {
  try {
    // Проверяем, доступен ли Telegram WebApp
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp
      webApp.ready()
      webApp.expand()
      webApp.headerColor = '#1a1a1a'
      webApp.backgroundColor = '#1a1a1a'
      
      return {
        isAvailable: true,
        user: webApp.initDataUnsafe?.user || mockTelegramUser,
        webApp
      }
    } else {
      // Fallback для разработки
      console.log('Telegram WebApp not available, using mock data')
      return {
        isAvailable: true,
        user: mockTelegramUser,
        webApp: null
      }
    }
  } catch (error) {
    console.error('Telegram WebApp not available:', error)
    return {
      isAvailable: true,
      user: mockTelegramUser,
      webApp: null
    }
  }
}

export const sendOrderToBot = async (orderData: {
  items: Array<{ name: string; quantity: number; price: number }>
  total: number
  user: TelegramUser
  address: { text: string; lat: number; lng: number }
  jointsUsed?: number
  finalAmount: number
}) => {
  const botToken = '8219153061:AAFKad_M06tTrOez7guNNtGDVxaMBqWxgoU'
  const chatId = 517453850 // Ваш Telegram ID
  
  const itemsList = orderData.items
    .map(item => `• ${item.name} x${item.quantity} - ${item.price * item.quantity}₿`)
    .join('\n')
    
  const paymentInfo = orderData.jointsUsed 
    ? `💰 *Сумма заказа:* ${orderData.total}₿\n🚬 *Использовано косяков:* ${orderData.jointsUsed}₿\n💳 *К доплате:* ${orderData.finalAmount}₿`
    : `💰 *Общая сумма:* ${orderData.finalAmount}₿`
    
  const message = `
🛍️ *Новый заказ!*

📦 *Товары:*
${itemsList}

${paymentInfo}

👤 *Покупатель:*
ID: ${orderData.user.id}
Имя: ${orderData.user.first_name} ${orderData.user.last_name || ''}
Username: @${orderData.user.username || 'не указан'}

📍 *Адрес доставки:*
${orderData.address.text}
[Открыть на карте](https://maps.google.com/?q=${orderData.address.lat},${orderData.address.lng})
  `.trim()

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    })
    
    return response.ok
  } catch (error) {
    console.error('Error sending order to bot:', error)
    return false
  }
}