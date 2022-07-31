import S3 from 'aws-sdk/clients/s3';


const importProductsFile = async (event = {}) => {
    const { AWS_REGION, BUCKET } = process.env;
    const s3 = new S3({ region: AWS_REGION });

    console.log(event, 'importProductsFile log');

    try {
        const { name = '' } = event.queryStringParameters;
        const params = {
            Bucket: BUCKET,
            Key: `uploaded/${name}`,
            Expires: 60,
            ContentType: 'text/csv',
        };

        const urlPromise = s3.getSignedUrlPromise('putObject', params);
        const url = await urlPromise;

        console.log(url, 'url test')

        return {
            body: JSON.stringify(url),
            statusCode: 200,
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
    }
};

export default importProductsFile