

interface categoryTypeId {
  type_id?: string,
}
interface categoryIntefrace {
  category_detail?: categoryTypeId
}

interface venderDetailInterface {
  name?: string
}

interface productInterface {
  variant: any,
  add_on: any,
  category?: categoryIntefrace,
  vendor?: venderDetailInterface,
  sku: string,
  minimum_order_count: number,
  translation?: any,
  reviews?: (object)[],
  averageRating?: number | string
}

interface coupnListArry { name: number; short_desc: string };

export interface ProductDetailInterface {
  coupon_list: Array<coupnListArry>,
  relatedProducts: any,
  products: productInterface,
}
