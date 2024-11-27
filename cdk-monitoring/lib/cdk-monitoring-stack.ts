import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

import { BedrockCwDashboard } from '@cdklabs/generative-ai-cdk-constructs';
import * as cw from 'aws-cdk-lib/aws-cloudwatch';
import { Duration } from 'aws-cdk-lib';

export class CdkMonitoringStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkMonitoringQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
    const bddashboard = new BedrockCwDashboard(this, 'BedrockDashboardConstruct', {});

    // provides monitoring of all models
    bddashboard.addAllModelsMonitoring({});

    // provides monitoring for a specific model
    bddashboard.addModelMonitoring('Anthropic Claude 3 Sonnet', 'anthropic.claude-3-sonnet-20240229-v1:0', {});

    // Create additional Bedrock metrics
    const invocationsServerErrorsAllModelsMetric = new cw.Metric({
      namespace: 'AWS/Bedrock',
      metricName: 'InvocationServerErrors',
      statistic: cw.Stats.SAMPLE_COUNT,
      period: Duration.hours(1),
    }); 
    // Add widgets for these additional metrics to the dashboard
    bddashboard.dashboard.addWidgets(
      new cw.SingleValueWidget({
        title: 'Server Errors (All Models)',
        metrics: [invocationsServerErrorsAllModelsMetric],
        width: 12,
      }),
      // new cw.SingleValueWidget({
      //   title: 'Invocation Throttles',
      //   metrics: [invocationsThrottlesAllModelsMetric],
      //   width: 12,
      // })
    );
    
  }
}
