# Pulumi Playground

This repository is used as a playground to practice infrastructure as code with [Pulumi](https://www.pulumi.com/).

The idea is to use the AWS Provider together with Localstack in order to simulate deploying to a cloud platform.

This project uses the [Pulumi Automation API](https://www.pulumi.com/docs/guides/automation-api/) and does not rely on the Pulumi CLI.

## Local Development

Please install and configure the following tools in order to run, deploy and test the applications provided in this repository:

* [Docker](https://docs.docker.com/get-docker/)
* [Node.js v16.x](https://nodejs.org/en/download/releases/)
* [Localstack](https://docs.localstack.cloud/get-started/#installation)

## Integration tests

To test the infrastructure deployment, run the following command in your shell:

```bash
yarn test
```

The tests will setup an ephemeral Localstack instance using docker, as well as ephemeral state directory for Pulumi, which will be both teared down at the end of the suite.

## Caveats

This project relies on the OSS version of Localstack which offers a limited set of AWS services, that being said the offering is anyway good enough to cover most common use cases.

Keep in mind that IAM policies are not evaluated or enforced (i.e. operations are all allowed, none are denied) in the OSS version.