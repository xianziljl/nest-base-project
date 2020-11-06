import { Brackets, DeepPartial, DeleteResult, Repository, SelectQueryBuilder } from 'typeorm'
import { BaseQuery, FilterQuery, PageQuery, PageResult, SortQuery } from './base.dto'

const DEFAULT_PAGE_SIZE = 30

export class BaseService<T> {
  repository: Repository<T>

  static strToArr(str?: string): string[] {
    return str?.split(',').filter(a => a)
  }

  get tableName(): string {
    return this.repository.metadata.tableName
  }
  // 当前表中的所有字段
  get repositoryFields(): Set<string> {
    const map = this.repository.metadata.propertiesMap
    return new Set(Object.keys(map))
  }

  getQB(): SelectQueryBuilder<T> {
    return this.repository.createQueryBuilder(this.tableName)
  }
  // 关联表查询 ?joins=role.id,role.name,avatar
  joinQB(qb: SelectQueryBuilder<T>, joins: string): SelectQueryBuilder<T> {
    if (joins) {
      const arr = BaseService.strToArr(joins).map(str => str.split('.'))
      const tbs = new Set(arr.map(item => item[0]))

      for (const tb of tbs) qb.leftJoin(`${this.tableName}.${tb}`, tb)

      arr.forEach(([tb, field]) => qb.addSelect(field ? `${tb}.${field}` : tb))
    }
    return qb
  }
  // 字段筛选 ?name=name1,name2,NULL
  filterQB(qb: SelectQueryBuilder<T>, query: FilterQuery = {}): SelectQueryBuilder<T> {
    const { tableName, repositoryFields } = this
    for (const key in query) {
      if (repositoryFields.has(key)) {
        const arr = BaseService.strToArr(query[key])
        const valArr = arr.filter(val => val !== 'NULL')
        const nullArr = arr.filter(val => val === 'NULL')
        if (arr.length) {
          qb.andWhere(new Brackets(_qb => {
            if (valArr.length) _qb.where(`${tableName}.${key} IN (:...${key}s)`, { [`${key}s`]: valArr })
            if (nullArr.length) _qb.orWhere(`${tableName}.${key} IS NULL`)
          }))
        }
      }
    }
    return qb
  }
  // 范围筛选 ?ranges=created:2020-01-01~2020-12-31,id:~100,age:30~
  rangeQB(qb: SelectQueryBuilder<T>, ranges: string): SelectQueryBuilder<T> {
    if (ranges) {
      const { tableName } = this
      const arr = BaseService.strToArr(ranges)
      const obj = {}
      arr.forEach(str => {
        const _arr = str.split(':')
        const field = _arr[0]
        const rangeStr = _arr[1]
        if (field && rangeStr) {
          const range = rangeStr.split('~')
          const min = range[0]
          const max = range[1]
          if (obj[field]) obj[field].push({ min, max })
          else obj[field] = [{ min, max }]
        }
      })

      for (const field in obj) {
        const _ranges = obj[field]
        qb.andWhere(new Brackets(_qb => {
          _ranges.forEach(({ min, max }, i: number) => {
            if (min && max) _qb.orWhere(`${tableName}.${field} BETWEEN :${field}_min_${i} AND :${field}_max_${i}`, { [`${field}_min_${i}`]: min, [`${field}_max_${i}`]: max })
            else if (min) _qb.orWhere(`${tableName}.${field} >= :${field}_min_${i}`, { [`${field}_min_${i}`]: min })
            else if (max) _qb.orWhere(`${tableName}.${field} <= :${field}_max_${i}`, { [`${field}_max_${i}`]: max })
          })
        }))
      }
    }
    return qb
  }
  // 字段搜索 ?searchFields=name,username&search=hello
  searchQB(qb: SelectQueryBuilder<T>, searchFields: string, search: string): SelectQueryBuilder<T> {
    if (searchFields) {
      const arr = BaseService.strToArr(searchFields)
      qb.andWhere(new Brackets(_qb => {
        arr.forEach(field =>  _qb.orWhere(`${this.tableName}.${field} like :search`, { search: `%${search}%` }))
      }))
    }
    return qb
  }
  // 排序 ?sort=-name OR sort=+name
  sortQB(qb: SelectQueryBuilder<T>, sort: string): SelectQueryBuilder<T> {
    if (sort) {
      const orderBy = sort.replace(/^[+-]?/, '')
      const _order = sort[0] === '-' ? 'DESC' : 'ASC'
      qb.orderBy(`${this.tableName}.${orderBy}`, _order)
    }
    return qb
  }
  // 分页 ?page=1&pageSize=10
  pageQB(qb: SelectQueryBuilder<T>, page: number, pageSize: number): SelectQueryBuilder<T> {
    qb.skip((page - 1) * pageSize).take(pageSize)
    return qb
  }

  
  async findById(id: number | string, query: BaseQuery = {}): Promise<T> {
    const qb = this.getQB()
    this.joinQB(qb, query.joins)
    qb.where(`${this.tableName}.id = :id`, { id })
    return qb.getOne()
  }
  // 适用于根据条件查找单个用于比较是否有重复
  async findOne(query: FilterQuery): Promise<T> {
    const qb = this.getQB()
    this.joinQB(qb, query.joins)
    qb.where(query as Partial<T>)
    return qb.getOne()
  }
  
  async findAll(query?: SortQuery): Promise<T[]> {
    const qb = this.getQB()
    this.joinQB(qb, query?.joins)
    this.sortQB(qb, query.sort)
    return qb.getMany()
  }

  async filterSort(query: FilterQuery): Promise<T[]> {
    const qb = this.getQB()
    this.joinQB(qb, query.joins)
    this.filterQB(qb, query)
    this.rangeQB(qb, query.ranges)
    this.searchQB(qb, query.searchFields, query.search)
    this.sortQB(qb, query.sort)
    return qb.getMany()
  }

  async filterSortPage(query: PageQuery): Promise<PageResult<T>> {
    const page = ~~query.page || 1
    const pageSize = ~~query.pageSize || DEFAULT_PAGE_SIZE
    
    const qb = this.getQB()
    this.joinQB(qb, query.joins)
    this.filterQB(qb, query)
    this.rangeQB(qb, query.ranges)
    this.searchQB(qb, query.searchFields, query.search)
    this.sortQB(qb, query.sort)
    this.pageQB(qb, page, pageSize)
    const res = await qb.getManyAndCount()
    const total = res[1]
    const list = res[0]
    // console.timeEnd('query')
    return { page, pageSize, total, list }
  }

  async createOrUpdate(data: { [key: string]: any }): Promise<T> {
    let item: T
    if (data.id) item = await this.repository.preload(data as DeepPartial<T>)
    else item = this.repository.create(data as DeepPartial<T>)
    await this.repository.save(item)
    return item
  }

  async delete(ids: string): Promise<DeleteResult> {
    const idsArr = BaseService.strToArr(ids)
    return await this.repository.softDelete(idsArr)
  }
}