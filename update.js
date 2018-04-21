import * as dynamoDbLib from "./libs/dynamodb-lib";
import {
    success,
    failure
} from "./libs/response-lib";

export async function main(event, context, callback) {
    const data = JSON.parse(event.body);
    const params = {
        TableName: "meterData",
        // 'Key' defines the partition key and sort key of the item to be updated
        // - 'userId': Identity Pool identity id of the authenticated user
        // - 'meterId': path parameter
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            meterId: event.pathParameters.id
        },
        // 'UpdateExpression' defines the attributes to be updated
        // 'ExpressionAttributeValues' defines the value in the update expression
        UpdateExpression: "SET content = :content, attachment = :attachment",
        ExpressionAttributeValues: {
            ":attachment": data.attachment ? data.attachment : null,
            ":content": data.content ? data.content : null
        },
        ReturnValues: "ALL_NEW"
    };


    try {
        const result = await dynamoDbLib.call("update", params);
        callback(null, success({
            status: true
        }));
    } catch (e) {
        logException(e);
        callback(null, failure({
            status: false
        }));
    }

    function logException(e) {
        console.log(e);
    }
}