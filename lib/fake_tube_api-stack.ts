import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as nodejsLambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";

interface FakeTubeApiProps extends StackProps {
  table: dynamodb.Table
}

export class FakeTubeApiStack extends Stack {
  public readonly api: apigateway.RestApi;
  public readonly handler: lambda.Function;

  constructor(scope: Construct, id: string, props: FakeTubeApiProps) {
    super(scope, id, props);

    this.api = new apigateway.RestApi(this, "videos-api", {
      cloudWatchRole: false, // Needed as hack for AWS Academy, usually you don't need to specify that
      restApiName: "Videos API Service",
      description: "This service serves videos."
    });

    this.handler = new nodejsLambda.NodejsFunction(this, "VideoHandler", {
      runtime: lambda.Runtime.NODEJS_16_X,
      entry: 'resources/videos.ts',
      role: iam.Role.fromRoleName(this, "LabRole", "LabRole", { mutable: false }),
      environment: {
        VIDEOS_TABLE_NAME: props.table.tableName
      },
      // EX1: Enable tracing with tracing parameter here
    });

    const videosResource = this.api.root.addResource('videos');

    const videosIntegration = new apigateway.LambdaIntegration(this.handler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });

    videosResource.addMethod("GET", videosIntegration);

    const videoItemResource = videosResource.addResource('{id}')
    videoItemResource.addMethod("GET", videosIntegration);

    // create model for payload validation
    const videoModel = new apigateway.Model(this, "post-videos-validator", {
      restApi: this.api,
      contentType: "application/json",
      description: "To validate video create payload",
      modelName: "videomodelcdk",

      // schema (allowed shape) of our payload
      schema: {
        type: apigateway.JsonSchemaType.OBJECT,
        required: ["title"],
        properties: {
          title: { type: apigateway.JsonSchemaType.STRING },
        },
      }
    });


    // create request validation API Gateway resource
    const requestValidator = new apigateway.RequestValidator(
      this,
      "body-validator",
      {
        restApi: this.api,
        requestValidatorName: "body-validator",
        validateRequestBody: true,
      }
    )

    // create new endpoint (POST /videos) - validator and model are configuration options
    videosResource.addMethod('POST', videosIntegration, {
      requestValidator,
      requestModels: {
        "$default": videoModel
      },
    });
  }
}
