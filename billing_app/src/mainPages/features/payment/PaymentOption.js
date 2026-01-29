// import React from 'react'

// export default function PaymentOption({ payment, setPayment }) {
//     return (
//         <>
//             <label className='form-label' htmlFor='payment'>Payment</label>
//             <select className='form-select' id='payment' value={payment} onChange={(e) => setPayment(e.target.value)} required>
//                 <option value=''>Select payment</option>
//                 <option value='Cash'>Cash</option>
//                 <option value='Account'>Account</option>
//             </select>
//         </>
//     )
// }

import React from 'react'

export default function PaymentOption({
    payment,
    setPayment,
    id = 'payment',
    label = 'Payment',
    loanPayment = false
}) {
    return (
        <>
            <label className='form-label' htmlFor={id}>{label}</label>

            <select
                className='form-select'
                id={id}
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                required
            >
                <option value=''>Select payment</option>
                <option value='Cash'>Cash</option>
                <option value='Account'>Account</option>

                {loanPayment && (
                    <option value='Short Cash'>Short Cash</option>
                )}
            </select>
        </>
    )
}


