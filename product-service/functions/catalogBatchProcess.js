import AWS from 'aws-sdk';
import createProduct from './createProduct';

const { AWS_REGION, SNS_ARN } = process.env;

const snsPublish = async (product) => {
    const sns = new AWS.SNS({ region: AWS_REGION });

    try {
        console.log('SNS publish');

        await sns.publish({
            Subject: 'Added',
            Message: JSON.stringify(product),
            TopicArn: SNS_ARN,
            MessageAttributes: {
                expensive: {
                    DataType: 'String',
                    StringValue: Boolean(product.price > 200).toString(),
                },
            },
        }).promise();

        console.log('Notification was sent.');
    } catch (error) {
        console.log(error);
    }
}

const catalogBatchProcess = async (event = {}) => {
    let response;
    const sns = new AWS.SNS({ region: AWS_REGION });
    console.log('catalogBatchProcess', event);

    try {
        const records = event.Records || [];

        if (!records.length) {
            throw new Error('records error');
        }

        console.log('Records', records);

        const products = await Promise.all(records.map(async (record) => {
            try {
                const product = await createProduct(record);

                await snsPublish(product);

                return product;
            } catch (error) {
                console.log(error);

                return null;
            }
        }));
        const createdProducts = products.filter((item) => item);

        response =  {
            body: JSON.stringify(createdProducts),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
            }
        }

    } catch (error) {
        console.log(error);
        response =  {
            statusCode: 500,
            error: error.message,
        };
    }

    return response;
};

export default catalogBatchProcess
