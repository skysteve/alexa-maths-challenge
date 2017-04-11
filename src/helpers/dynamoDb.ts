import aws = require('aws-sdk');

declare var process;

const TABLE_NAME = process.env.TABLE_NAME;
let dynamo;

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

export function get(userId: string): Promise<any> {
  if(!dynamo) {
    dynamo = new aws.DynamoDB.DocumentClient();
  }

  const params = {
    Key: {
      userId
    },
    TableName: TABLE_NAME,
    ConsistentRead: true
  };

  return new Promise((resolve, reject) => {
    dynamo.get(params, (err, data) => {
      console.log('GET', JSON.stringify(data, null, 2));
      if (err) {
        return reject(err);
      }

      if(isEmptyObject(data)) {
        return resolve({});
      }

      resolve(data.Item.mapAttr);
    });
  });
}

export function set(userId: string, data: any): Promise<any> {
  console.log('Set value', data, userId);

  if(!dynamo) {
    dynamo = new aws.DynamoDB.DocumentClient();
  }

  const params = {
    Item: {
      userId,
      mapAttr: data
    },
    TableName: TABLE_NAME
  };

  return new Promise((resolve, reject) => {
    dynamo.put(params, (err, response) => {
      if (err) {
        return reject(err);
      }

      resolve(response);
    });
  });
}
