# G5 Testing machine with Cypress.io

1. Run `npm install`.
2. Create a file called **cypress.env.json** in the main dir.
3. Add the following code to the file created with **your credentials**.
{
    "cms_auth_email": "",
    "cms_auth_password": ""
}
4. To run the test machine use `cypress open`.

## Generate reports using mochawesome

1. You can generate reports by running `cypress run --reporter mochawesome`, where it will generate a video, screenshots and an HTML page showing details of the test.