# sls-image-uploader
It's simple image uploader by Serverless framework (with AWS).

## Usage
### 1. Sign in AWS Console
### 2. Create Programmatic User in AWS
#### 1) AWS IAM Console
![](https://csy-image-uploader-bucket.s3.ap-northeast-2.amazonaws.com/image/saMTzm9c.png)
#### 2) Add new use
![](https://csy-image-uploader-bucket.s3.ap-northeast-2.amazonaws.com/image/jPb1XkIY.png)
#### 3) Set permissions
![](https://csy-image-uploader-bucket.s3.ap-northeast-2.amazonaws.com/image/98YO5uds.png)
#### 4) Download .csv file
![](https://csy-image-uploader-bucket.s3.ap-northeast-2.amazonaws.com/image/mZOO1-z8.png)
### 3. Set serverless config in Ubuntu 18.04
```
# access_key_id, access_key_secret is in .csv file.
serverless config credentials --provider aws --key <your_access_key_id> --secret <your_access_key_secret>
```
### 4. Deploy
```
sls deploy
```
### 5. Usage
```
METHOD : POST 
URL : https://[your-amazon-lambda-endpoint]/dev/images
Body : 
 - imageData
 - imageName
```
#### Postman Example
![POSTMAN Example](https://csy-image-uploader-bucket.s3.ap-northeast-2.amazonaws.com/image/image-uploader-usage-example.PNG)
