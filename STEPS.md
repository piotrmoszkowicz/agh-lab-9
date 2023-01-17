# Aim of the lab

We will add XRay tracing & Alerts into our application.

# Prerequisites

1. Installing packages

```
npm install
```

2. Bootstrapping

This will create the project in the AWS.

> ❗️ You can find the `bootstrap-template.yml` file inside the project.

```
cdk bootstrap --template bootstrap-template.yaml 
```

3. Deploy

Run `cdk deploy --all`. Make sure deployment went well and we have API gateway that exposes three endpoint:

1. `GET /videos`
2. `POST /videos`
3. `GET /videos/{id}`

For now the responses are fixed. Don't worry we will fix that in upcoming exercises.

# Exercise 1 - Add XRay tracing

1. Install `2.60.0` version of `aws-cdk` with `npm i -g aws-cdk@2.6.0 --force`.
2. Look for comments in Code starting with "EX1". Fill them with instruction.
3. Regularly use `cdk deploy --all` after changes you make and want to push into the cloud.
4. When it works, do some requests to your API:
   1. Creating video: `curl -i -X POST https://<YOUR GW ID>.execute-api.us-east-1.amazonaws.com/prod/videos -d '{"id": "dQw4w9WgXcQ", "title": "Rick Astley - Never Gonna Give You Up (Official Music Video)"}'`.
   2. Getting videos: `curl -i https://<YOUR GW ID>.execute-api.us-east-1.amazonaws.com/prod/videos`.
5. After you finish show your tutor, that there are existing traces in AWS X-Ray (it is part of AWS CloudWatch) and you can see logs with AWS Cloudwatch Logs.

# Exercise 2 - Add alarm

1. Look for comments in Code starting with "EX2" (it will be just `fake_tube_monitoring-stack.ts`) and fill the instructions.
2. Regularly use `cdk deploy --all` after changes you make and want to push into the cloud.
3. After you finish show your tutor, that there is existing monitoring dashboard with data. 

