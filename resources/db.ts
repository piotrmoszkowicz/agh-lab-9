import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Tracer } from "@aws-lambda-powertools/tracer";

const ddbClient = new DynamoDBClient({});
let dddbClient = DynamoDBDocumentClient.from(ddbClient);

export function patchDynamoClient(tracer: Tracer) {
  dddbClient = DynamoDBDocumentClient.from(tracer.captureAWSv3Client(ddbClient));
}

export function getDynamoClient() {
  return dddbClient;
}
