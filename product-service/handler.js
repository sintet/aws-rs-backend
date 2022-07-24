'use strict';

module.exports.hello = async (event) => {

  console.log('test', event )

  return {
    statusCode: 200,
    body: {
      productName: 'Test',
      price: 100
    }
  };
};
