import { Order } from '@/domain/enterprise/entities/order'

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      id: order.id.toString(),
      orderCode: order.orderCode,
      clientId: order.clientId.toString(),
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items?.map(item => ({
        id: item.id.toString(),
        productId: item.productId.toString(),
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
      })),
    }
  }
}
