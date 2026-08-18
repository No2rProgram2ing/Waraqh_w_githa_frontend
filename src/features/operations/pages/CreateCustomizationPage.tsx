import { Helmet } from 'react-helmet-async'
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
