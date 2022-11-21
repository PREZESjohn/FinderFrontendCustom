import {GroupRoom} from '../GroupRoom';

export interface Page {
  content: GroupRoom[],
  pageable:
    {
      sort:
        {
          empty: boolean,
          sorted: boolean,
          unsorted: boolean
        },
      offset: number,
      pageNumber: number,
      pageSize: number,
      unpaged: boolean,
      paged: boolean
    },
  last: boolean,
  totalPages: number,
  totalElements: number,
  number: number,
  size: number,
  sort:
    {
      empty: boolean,
      sorted: boolean,
      unsorted: boolean
    },
  first: boolean,
  numberOfElements: number,
  empty: boolean
}

