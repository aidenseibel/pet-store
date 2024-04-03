class User{

	constructor(c_id,c_username,c_email,c_password,c_physical_address,c_city,c_state,c_zip,c_is_vendor){
		this.id = c_id;
		this.username = c_username;
		this.email = c_email;
		this.password = c_password;
		this.physical_address = c_physical_address;
		this.city = c_city;
		this.state = c_state;
		this.zip = c_zip;
		this.is_vendor = c_is_vendor;
	}
}


module.exports = User;