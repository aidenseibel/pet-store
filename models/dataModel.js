const dataModel = {
  getStoreName: () => {
    return 'hamsterstore';
  },
  getAllListings: () => {
    return 'all listings';
  },
  getProfile: () => {
    return 'profile';
  },
  getProduct: (product_id) => {
    return 'product id = ' + product_id ;
  },
  getCart: () => {
    return 'cart';
  },
  getOrders: () => {
    return 'orders';
  },
};

module.exports = dataModel;