import * as AWS from 'aws-sdk';

const secMgr = new AWS.SecretsManager({
  endpoint: 'https://secretsmanager.us-east-1.amazonaws.com',
  region: 'us-east-1',
});

const getSecretValue = async (key: string): Promise<any> => {
  console.log('Getting Secret:', { key });
  const params = { SecretId: key };
  try {
    const retVal = await secMgr.getSecretValue(params).promise();
    console.log('Got Secret:', { key });
    return JSON.parse(retVal.SecretString as string);
  } catch (e) {
    console.error('Failed to get Secret:', { key, e });
    return e;
  }
};

export default getSecretValue;
