import RCPagination from 'rc-pagination'

export interface PaginationProps {
  count: number
  page: number
}

export function Pagination({ count, page }: PaginationProps) {
  return (
    <div className="flex justify-center my-4">
      <RCPagination
        className="flex gap-4"
        current={page}
        itemRender={(current, type, element) => {
          if (type === 'jump-next' || type === 'jump-prev') {
            return <a href={`/pokedex?page=${current}`}>...</a>
          }
          if (type === 'page') {
            return current === page ? (
              <span className="border border-slate-500 rounded-md py-1 px-2">
                {current}
              </span>
            ) : (
              <a
                className="border border-white hover:border-slate-500 rounded-md py-1 px-2"
                href={`/pokedex?page=${current}`}
              >
                {current}
              </a>
            )
          }
        }}
        total={count}
        defaultPageSize={24}
      />
    </div>
  )
}
