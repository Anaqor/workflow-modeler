const { createModdle } = require('bpmnlint/lib/testers/helper');

const RuleTester = require('bpmnlint/lib/testers/rule-tester');

const invalidServiceTaskSubscriptionRule = require('./rules/invalid-service-task-subscription.js');


RuleTester.verify('invalid-service-task-subscription', invalidServiceTaskSubscriptionRule, {
  valid: [
    {
      moddleElement: createModdle(
        '<serviceTask xmlns:planqk="https://platform.planqk.de"  id="Activity_0gedulf" ' +
        'name="Seppones API" subscriptionId="sub1" applicationName="Seppones App" ' +
        'consumerKey="app1ConsumerKey" consumerSecret="app1ConsumerSecret" ' +
        'serviceName="Seppones API" ' +
        'serviceEndpoint="www.seppone-gateway.de/api1" ' +
        'result="${output}" />',
        'planqk:serviceTask'
      )
    }
  ],
  invalid: [
    {
      moddleElement: createModdle(
        '<serviceTask xmlns:planqk="https://platform.planqk.de"  id="Activity_0gedulf" />',
        'planqk:serviceTask'
      ),
      report: {
        id: 'Activity_0gedulf',
        message: 'PlanQK service task has no subscription assigned.'
      }
    }
  ]
});

