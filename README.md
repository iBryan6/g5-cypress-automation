# G5 Testing machine with Cypress.io

1. Run `npm install`.
2. Create a file called **cypress.env.json** in the main dir.
3. Add the following code to the file created with **your credentials**.
```
{
    "cms_auth_email": "",
    "cms_auth_password": ""
}
```
4. To open Cypress UI test machine use `cypress open` or `npm run test`.

## Generate reports using mochawesome

1. You can generate reports where it will generate a video, screenshots and an HTML page showing details of the tests.
    `npm run cypress:run:staging` generates a full staging report
    `npm run cypress:run:prime` generates a full prime report
    `npm run cypress:run:prod` generates a full prod report
    
2. If you wish you run a specific file you need to run something like `cypress run --env TESTING_ENV=staging --spec cypress/integration/cms/basic_func.spec.js --reporter mochawesome`.
