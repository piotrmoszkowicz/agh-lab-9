import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { MonitoringFacade } from "cdk-monitoring-constructs";

import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";

interface FakeTubeMonitoringProps extends StackProps {
  api: apigateway.RestApi;
  handler: lambda.Function;
  table: dynamodb.Table;
}

export class FakeTubeMonitoringStack extends Stack {
  constructor(scope: Construct, id: string, { api, handler, table, ...props}: FakeTubeMonitoringProps) {
    super(scope, id, props);

    const monitoring = new MonitoringFacade(this, "Monitoring");

    // EX2: Add monitoring of API Gateway, Lambda and DynamoDB Table with cdk-monitoring-constructs.
    // Uncomment code below + add some methods calls to it to enable monitoring.
    // More in docs: https://github.com/cdklabs/cdk-monitoring-constructs#cdk-monitoring-constructs

    // monitoring
    //   .addLargeHeader("FakeTubeMonitoring")
  }
}
