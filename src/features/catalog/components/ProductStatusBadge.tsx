
interface ProductStatusBadgeProps {
  isActive: boolean
}

function ProductStatusBadge({
  isActive,
}: ProductStatusBadgeProps) {
  return (
    <span
      className={
        isActive
          ? 'inline-flex items-center rounded-full bg-[var(--color-accent-subtle)] px-3 py-1 text-xs font-semibold text-[#45592D]'
          : 'inline-flex items-center rounded-full bg-[#F3F0EC] px-3 py-1 text-xs font-semibold text-[var(--color-text-muted)]'
      }
    >
      {isActive ? 'نشط' : 'غير نشط'}
    </span>
  )
}

export default ProductStatusBadge
