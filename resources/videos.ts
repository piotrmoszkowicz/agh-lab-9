import { Context, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
// EX1: Import Lambda Powertools Tracer, Logger and Metrics
import { createVideo, findVideo, listVideos } from './repository';

// EX1: Create instances of Powertools:
// - Tracer (https://awslabs.github.io/aws-lambda-powertools-typescript/latest/core/tracer/#installation)
// - Logger (https://awslabs.github.io/aws-lambda-powertools-typescript/latest/core/logger/#installation)
// - Metrics (https://awslabs.github.io/aws-lambda-powertools-typescript/latest/core/metrics/#installation)

// EX1: Use function `patchDynamoClient` from `db.ts` file and patch Tracer to capture DynamoDB requests. Make sure pass Tracer instance as argument!

// EX1: With https://awslabs.github.io/aws-lambda-powertools-typescript/latest/core/tracer/#lambda-handler make sure our handler uses Tracer, Logger and Metrics
// (you need to install Middy and use it as shown) for Metrics ensure we capture cold starts (https://awslabs.github.io/aws-lambda-powertools-typescript/latest/core/metrics/#capturing-a-cold-start-invocation-as-metric)
export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  // logging event is helpful when developing
  console.log('Event', event)
  const { resource, httpMethod } = event;

  // event contains information about the API resource
  if (resource === '/videos' && httpMethod === 'GET') {

    // retrieve videos
    const videos = await listVideos()

    // return response
    return {
      statusCode: 200,
      body: JSON.stringify({ videos })
    };
  }

  else if (resource === '/videos/{id}' && httpMethod === 'GET') {
    const { pathParameters } = event;
    const video = await findVideo(pathParameters?.id!)

    if (video) {
      // if videos with specified id exist return 200
      return {
        statusCode: 200,
        body: JSON.stringify(video)
      };
    } else {
      // otherwise return 404 error
      return {
        statusCode: 404,
        body: 'NotFound'
      };
    }
  }

  if (resource === '/videos' && httpMethod === 'POST') {
    // at this point we are sure the body correct - request validator is guarding that
    // we just need to parse it from string
    // `!` is a TS trick - TS does not know that body was already validated
    const dto = JSON.parse(event.body!)

    // EX1: Log dto with Lambda PowerTools Logger

    // create a video
    const video = await createVideo(dto.title)

    // return response
    return {
      statusCode: 201,
      body: JSON.stringify(video)
    };
  }

  // in case someone tries to call our lambda with unknown resource return 404
  return {
    statusCode: 404,
    body: 'NotFound'
  };
}
