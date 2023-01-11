# api.alpha.ca.gov
API endpoints for the alpha project

The <a href="alpha.ca.gov">alpha project</a> was a 12-week pilot project in 2019-20 that explored new approaches for state websites.

This code was originally written to run on Azure. The full original code is in the <a href="https://github.com/cagov/API">https://github.com/cagov/API</a> repository. Code we can continue to host at near zero cost has been refactored to run in AWS in this repository.

The API endpoints are written in node and were easy to refactor to run on AWS because of the excellent <a href="https://arc.codes/">https://arc.codes/</a> project.

## Running locally

See above link for more docs on arc.codes, this project can be run locally after install via:

```
npx arc sandbox
```

The endpoints available are listed in the app.arc file.

This was deployed to AWS infrastructure and responds via the api.alpha.ca.gov domain. This domain is using AWS nameservers and Route53 to point to the API Gateway. The architect project creates staging and production infrastructure based on AWS Lambdas to run the server side code.

The staging deploy command:

```
npx arc deploy
```

Created infrastructure at: <a href="https://1tki6zhu9k.execute-api.us-west-1.amazonaws.com">https://1tki6zhu9k.execute-api.us-west-1.amazonaws.com</a>

The production deploy command:

```
npx arc deploy --production
```

Created infrastructure at (also available at api.alpha.ca.gov): <a href="https://1wnaawkwsl.execute-api.us-west-1.amazonaws.com">https://1wnaawkwsl.execute-api.us-west-1.amazonaws.com</a>



