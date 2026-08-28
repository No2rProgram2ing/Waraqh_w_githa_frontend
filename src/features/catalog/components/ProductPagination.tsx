import { Pagination } from '@/components/shared/Pagination'

interface ProductPaginationProps {
    currentPage: number
    lastPage: number
    total: number
    from: number | null
    to: number | null
    onPageChange: (page: number) => void
    disabled?: boolean
}

function ProductPagination(props: ProductPaginationProps) {
   return <Pagination {...props} itemLabel="منتج" />
}

export default ProductPagination