
class Order{
	constructor(c_id,c_user_id,c_vendor_id,c_product_id,c_quantity,c_has_been_delivered){
		this.id = c_id;
		this.user_id = c_user_id;
		this.vendor_id = c_vendor_id;
		this.product_id = c_product_id;
		this.quantity = c_quantity;
		this.has_been_delivered = c_has_been_delivered;
	}
}

module.exports = Order;