import React, { Suspense } from 'react'
import StripeWrapper from './conmponets/StripeWrapper';

export default function page() {
  return (
    <div translate="no">
    <Suspense>
      <StripeWrapper />
    </Suspense>
    </div>
  )
}
