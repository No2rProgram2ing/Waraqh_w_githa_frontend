import React from 'react'
import { Helmet } from 'react-helmet'
import CustomizationForm from '../components/CustomizationForm'

export default function CreateCustomizationPage() {
  return (
    <div dir="rtl" className="space-y-6">
      <Helmet>
        <title>طلب جديد — تخصيص</title>
      </Helmet>

      <div>
        <CustomizationForm />
      </div>
    </div>
  )
}
