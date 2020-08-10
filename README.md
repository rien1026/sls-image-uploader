# sls-image-uploader
It's simple image uploader by Serverless framework.
with Typescript, Node, AWS Lambda, AWS S3, Koa.

## Usage
### 1. Prefare AWS Account for Serverless Framework
https://github.com/rien1026/document/blob/master/ServerlessWithAWS.md
### 2. Install Serverless Framework
```
npm install -g serverless
```
### 3. Install Packages
```
npm i
```
### 4. Test
```
npm run local
```
### 5. Deploy
```
npm run deploy
```
### 6. Usage
#### Request
```
METHOD : POST 
URL : https://[your-amazon-lambda-endpoint]/dev/images
Body : 
 - image
Content-Type : multipart/form-data
```
#### Response
```
{
    "msg" : "suc",
    "data" : {
        "link" : "https://[s3-image-url]"
    }
}
```
#### Postman Example
![POSTMAN Example](https://csy-image-uploader-bucket.s3.ap-northeast-2.amazonaws.com/image/image-uploader-usage-example.png)
