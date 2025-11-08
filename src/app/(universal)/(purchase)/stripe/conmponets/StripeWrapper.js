"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
// import { createPaymentIntent } from "@/app/(universal)/action/stripe/actionStripe";
   import { createPaymentIntent } from "@/app/(universal)/action/stripe/actionStripe";
import { useCartContext } from "@/store/CartContext";
import { useRouter, useSearchParams } from "next/navigation";
//import { ProductType } from "@/app/(universal)/action/";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState("");
  const router = useRouter();

  const searchParams = useSearchParams();
     const orderMasterId = searchParams.get("orderMasterId");
       const deliveryType = searchParams.get("deliveryType");
  const customerNote = searchParams.get("customerNote");
  const couponCode = searchParams.get("couponCode");
  const couponDiscount = searchParams.get("couponDiscount");

  const {  endTotalG } = useCartContext();
  

  if (typeof window !== "undefined") {
    var customerAddress = JSON.parse(localStorage.getItem("customer_address"));
  }


  const handlePayment = async (e) => {
    e.preventDefault();

    const full_name = customerAddress.firstName + " " + customerAddress.lastName;
    const totalAmount = endTotalG * 100;
    console.log(customerAddress);
    console.log(totalAmount);
    console.log(full_name);

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    // const { clientSecret, error } = await createPaymentIntent({ amount: 2000 });

    const { clientSecret, error } = await createPaymentIntent({
      amount: totalAmount,
      customer: {
        name: full_name,
        email: customerAddress.email,
        phone: customerAddress.mobNo,
        address: {
          line1: customerAddress.addressLine1,
          line2: customerAddress.addressLine2,
          city: customerAddress.city,
          state: customerAddress.state,
          // postal_code: customerAddress.zipCode,
          country: "DE",
        },
      },
    });

    // const { clientSecret, error } = await createPaymentIntent({
    //   amount: totalAmount,
    //   name: 'John Doe',
    //   email: 'john@example.com',
    //   phone: '+1234567890',
    //   address: {
    //     line1: '123 Main Street',
    //     line2: 'Apt 4B',
    //     city: 'New York',
    //     state: 'NY',
    //     postal_code: '10001',
    //     country: 'US',
    //   },
    // });

    if (error) {
      setStatus(error);
      return;
    }

    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

    if (confirmError) {
     // setStatus(confirmError.message);
      router.push(`/order-fail?paymentType=paypal&status=fail&orderMasterId=${orderMasterId}`)
    } else if (paymentIntent.status === "succeeded") {
      router.push(`/complete?paymentType=paypal&status=success&orderMasterId=${orderMasterId}&deliveryType=${deliveryType}&customerNote=${customerNote}&couponCode=${couponCode}&couponDiscount=${couponDiscount}`)
     // setStatus("Payment successful!");
    }
  };

  return (
   
      <form onSubmit={handlePayment}>
        <CardElement />
       
          <button
            className="bg-amber-400 my-4 font-semibold text-slate-700 rounded-lg px-2 py-1 min-w-[200px]"
            type="submit"
            disabled={!stripe}
          >
            Pay{" "}
          </button>
          <p className="">{status}</p>
     
      </form>
   
  );
}

{/* <div className="min-h-[400px] flex justify-center items-center">
<form onSubmit={handlePayment}>
  <CardElement />
  <div className="flex flex-col gap-3">
    <button
      className="bg-amber-400 font-semibold text-slate-700 rounded-lg px-2 py-1 min-w-[200px]"
      type="submit"
      disabled={!stripe}
    >
      Pay{" "}
    </button>
    <p className="">{status}</p>
  </div>
</form>
</div> */}

export default function StripeWrapper() {
  return (
    <div className="container mx-auto py-5 px-5 border-slate-300 rounded-2xl">
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}
