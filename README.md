# sls-image-uploader
It's simple image uploader by Serverless framework.
with Typescript, Node, AWS Lambda, AWS S3, Koa.

## Usage
### 1. Prefare AWS Account for Serverless Framework.
https://github.com/rien1026/document/blob/master/ServerlessWithAWS.md
### 2. Install Serverless Framework.
```
npm install -g serverless
```
### 3. Deploy
```
sls deploy
```
### 4. Usage
```
METHOD : POST 
URL : https://[your-amazon-lambda-endpoint]/dev/images
Body : 
 - imageData
 - imageName
```
#### Postman Example
![POSTMAN Example](https://csy-image-uploader-bucket.s3.ap-northeast-2.amazonaws.com/image/image-uploader-usage-example.PNG)
