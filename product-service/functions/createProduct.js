import { Client } from 'pg';
import { dbConfig } from "../client";

module.exports.createProduct = async (event) => {
    const { body } = event;
    console.log(body, 'createProduct')

    if (!body) {
        return {
            statusCode: 400,
            error: 'Bad request',
        }
    }

    const { title, description, price } = body
    const addProductQuery = `INSERT INTO products(title, description, price) VALUES($1, $2, $3) RETURNING id`
    const addStocksQuery = `INSERT INTO stocks(product_id, products_count) VALUES($1, $2)`
    const client = new Client(dbConfig)

    await client.connect();

    try {
        if (!title || !description || !price) {
            return {
                statusCode: 400,
                error: 'Bad request',
            }
        }

        try {
            await client.query('BEGIN');

            const { rows } = await client.query(
                addProductQuery,
                [title, description, price],
            );

            const productId = rows[0].id;

            await client.query(
                addStocksQuery,
                [`${productId}`, 1],
            );

            await client.query('COMMIT');

            const res = {
                id: productId,
                title,
                description,
                price,
            }

            return {
                body: JSON.stringify(res),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                }
            };
        } catch (e) {
            await client.query('ROLLBACK')
            throw e;
        } finally {
            client.end();
        }

    } catch (error) {
        return {
            statusCode: 500,
            error: error.message,
        }
    }
};
