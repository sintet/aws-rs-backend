import { Client } from 'pg';
import { dbConfig } from "../client";

const getProductsById = async (event) => {
    const { productId } = event.pathParameters;
    const query = `
        select id, title, description, price, products_count from products 
            inner join stocks on id = product_id
            where id = '${productId}'
    `
    const client = new Client(dbConfig);
    await client.connect();

    try {
        const { rows: product } = await client.query(query)

        if (!product[0]) {
            return {
                statusCode: 400,
                error: 'Not found',
            }
        }
        return {
            body: JSON.stringify(product[0]),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
            }
        }

    } catch (error) {
        return {
            statusCode: 500,
            error: error.message,
        };
    } finally {
        client.end();
    }
};

export default getProductsById
