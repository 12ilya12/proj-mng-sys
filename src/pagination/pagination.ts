export interface IPagingOptions {
    page: number
    pageSize: number
    order: 'asc' | 'desc'
    orderBy: string
}

export type IPaging<T> = {
    items: T[]
    pagination: {
        totalItems: number
        totalPages: number
        options: Partial<IPagingOptions>
    }
}
   