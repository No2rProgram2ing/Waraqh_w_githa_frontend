import { Badge } from '@/components/ui/Badge'

interface ProductStatusBadgeProps {
  isActive: boolean
}

function ProductStatusBadge({
  isActive,
}: ProductStatusBadgeProps) {
  return (
    <Badge variant={isActive ? 'success' : 'neutral'}>
      {isActive ? 'نشط' : 'غير نشط'}
    </Badge>
  )
}

export default ProductStatusBadge
