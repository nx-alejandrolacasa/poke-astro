import RCPagination from 'rc-pagination'

export interface PaginationProps {
  count: number
  page: number
}

export function Pagination({ count, page }: PaginationProps) {
  return (
    <div className="flex justify-center my-4">
      <RCPagination
        className="flex gap-2"
        defaultCurrent={page}
        defaultPageSize={24}
        itemRender={(current, type, element) => {
          const href = `/pokedex/${current}`

          if (type === 'jump-next' || type === 'jump-prev') {
            return <span className="cursor-default">...</span>
          }

          if (type === 'page') {
            return (
              <a
                aria-label={`Go to page ${current}`}
                aria-current={current === page}
                className={`border ${
                  current === page ? 'cursor-default ' : 'border-white hover:'
                }border-slate-500 rounded-md py-1 px-2`}
                href={href}
              >
                {current}
              </a>
            )
          }
        }}
        showTitle={false}
        total={count}
      />
    </div>
  )
}
