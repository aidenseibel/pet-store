//class profile{

//	constructor(c_id,c_username,c_email,c_password,c_physical_address,c_city,c_state,c_zip,c_is_vendor){
//		this.id = c_id;
//		this.username = c_username;
//		this.email = c_email;
//		this.password = c_password;
//		this.physical_address = c_physical_address;
//		this.city = c_city;
//		this.state = c_state;
//		this.zip = c_zip;
//		this.is_vendor = c_is_vendor;
//	}
//}

class Listing{
	constructor(c_id,c_name,c_price,c_vendor_id,c_image_url,c_amount,c_ingredients,c_description){
		this.id = c_id;
		this.name = c_name;
		this.price = c_price;
		this.vendor_id = c_vendor_id;
		this.image_url = c_image_url;
		this.amount = c_amount;
		this.ingredients = c_ingredients;
		this.description = c_description;
	}
}

module.exports = Listing;