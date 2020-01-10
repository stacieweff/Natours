/* eslint-disable */
import axios from 'axios'
import { showAlert } from './alerts'

const stripe = Stripe('pk_test_bT9DAV2VrFhhZavDigW4bnEs00amkQXmag')

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`) // `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
  
    console.log(session)
  
    // 2) Create a checkout form + charge the credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    })

  } catch (error) {
    console.log(error)
    showAlert('error', error)
  }
}

