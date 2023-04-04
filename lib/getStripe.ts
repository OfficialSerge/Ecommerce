import { Stripe, loadStripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export default async function getStripe() {
  if (!stripePromise) {
    // process.env.STRIPE_PUBLISHABLE_KEY throws error 
    // saying apiKey must be string, weird cuz it already is.
    // Backticks is a workaround
    stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`);
  }
  return stripePromise;
}

