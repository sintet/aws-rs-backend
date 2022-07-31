import { Client } from 'pg';
import { dbConfig  } from "../client";

const getProductsList = async () => {
    const query = `
        select id, title, description, price, products_count
            from products
            inner join stocks on id = product_id
    `
    const client = new Client(dbConfig);
    await client.connect();
  
  try {
    const { rows: products } = await client.query(query);

    return {
      body: JSON.stringify(products),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      }
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      error: error.message,
    }
  } finally {
    client.end();
  }
};

export default getProductsList