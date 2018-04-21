import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import {
  success,
  failure
} from "./libs/response-lib";

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: "meterData",
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      meterDataId: uuid.v1(),
      meterId: data.meterId,
      meterType: data.meterType,
      consumption: data.consumption,
      crc: data.crc,
      readTime: data.readTime,
      content: data.content,
      attachment: data.attachment,
      createdAt: new Date().getTime()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    callback(null, success(params.Item));
  } catch (e) {
    console.log(e);
    console.log(params);
    callback(null, failure({
      status: false
    }));
  }
}
