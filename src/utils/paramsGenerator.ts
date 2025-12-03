// ===============================
// Params Generator Function
// ===============================
// Purpose: Creates a string of parameters from an object
// ===============================


export function paramsGenerator(payload: any) {
  let params = []
  const { limit, page, search, filters, like, find_in_set_any, group_by, order_by } = payload
  const in_data = payload.in
  const not_in_data = payload.not_in

  if (limit) { params.push(`limit=${limit}`) }
  if (page) { params.push(`page=${page}`) }
  if (search) { params.push(`search=${search}`) }

  for (const key in filters) {
    let sets :any = {
      '>': 'gt',
      '>=': 'gte',
      '<': 'lt',
      '<=': 'lte',
    }
    let custom = key.split(' ')
    if (custom[1]) {
      const operator = sets[custom[1]]  
      const field = custom[0]
      const value = filters[key]
      params.push(`${field}_${operator}=${value}`)
    }else{
      params.push(`${key}=${filters[key]}`)
    }
  }

  if (in_data) {
      for (const key in in_data) {
        params.push(`${key}_in=${in_data[key]}`)
      }
  }
  if (not_in_data) {
      for (const key in not_in_data) {
        params.push(`${key}_not_in=${not_in_data[key]}`)
      }
  }
  if (like) {
      for (const key in like) {
        params.push(`${key}_like=${like[key]}`)
      }
  }
  if (find_in_set_any) {
      for (const key in find_in_set_any) {
        params.push(`${key}_find_in_set_any=${find_in_set_any[key]}`)
      }
  }
  if (group_by) {
    params.push(`group_by=${group_by.join(',')}`)
  }
  if(order_by){
    let data = []
    let order = []
    for (const key in order_by) {
      data.push(key)
      order.push(order_by[key])
    }
    params.push(`order_by=${data.join(',')}`)
    params.push(`order_direction=${order.join(',')}`)
  }
  return params.join('&')
}