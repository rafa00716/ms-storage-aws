# 📦 ms-storage-aws

A microservice for file storage in **AWS S3** with **API Key authentication** and multi-tenancy support.  
It allows **uploading, downloading, deleting, and listing files**, organizing them into project-specific folders.

---

## 🚀 Features

✅ **Upload files to AWS S3**  
✅ **Download files with validation**  
✅ **Delete files from S3**  
✅ **List files in a bucket**  
✅ **API Key authentication**  
✅ **Multi-tenancy (each client has its own folder)**  
✅ **Uses `@aws-sdk/client-s3` (AWS SDK v3)**  
✅ **Unique file identifiers (`UUID + timestamp`)**  
✅ **File extension validation**  

---

## 🛠️ Installation

1️⃣ Clone the repository:
```sh
git clone https://github.com/rafa00716/ms-storage-aws.git
cd ms-storage-aws
```

2️⃣ Install dependencies:

```sh
npm install
```

## ⚙️ Configuration
#### Create a .env file in the project root and add AWS credentials and settings:

```sh
AWS_REGION=us-east-1
S3_BUCKET=my-s3-bucket
```

#### AWS Credentials (Use IAM Roles instead for better security)

```sh
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY
```
⚠ **Recommended**: Use IAM Roles instead of static credentials for better security.
## API Keys for clients (clients.json)
```sh
{
"123abc": "projectA", 
"456def": "projectB"
}
```
## ▶️ Usage
1️⃣ Run the server
sh

```sh
npm start
The service will be available at http://localhost:3000.
```

## 📌 API Endpoints
### 🔹 Upload a file
#### POST /upload/:filename

```json
Headers: { "x-api-key": "123abc" }
```
```json
Body (Form-Data): { file: logo.png }
```

```json
filename: 'users/assets/camioneta'
```
Response:

```json
{
    "message": "File uploaded successfully",
    "metadata": {
        "originalName": "logo.png",
        "filename": "users/assets/camioneta",
        "uploadedAt": "2025-02-27T23:46:14.979Z",
        "size": "132771",
        "mimeType": "image/png",
        "extension": ".png"
    }
}

```
## 🔹 Download a file
### GET /download/:filename
```json
Headers: { "x-api-key": "123abc" }
```
```json
Example: /download/1708805123456-550e8400-e29b-41d4-a716-446655440000_document.pdf
```
**Response:** Downloads the requested file.


## 🔹 Delete a file
### DELETE /delete/:filename
```json
Headers: { "x-api-key": "123abc" }
```
```json
Example: /delete/1708805123456-550e8400-e29b-41d4-a716-446655440000_document.pdf
```
Response:
```json
{ "message": "File deleted successfully" }
```
## 🔹 List files
### GET /list
```json
Headers: { "x-api-key": "123abc" }
```

Response:
```json
[
    "projectA/1708805123456-550e8400-e29b-41d4-a716-446655440000_document.pdf",
    "projectA/1708805145678-123e4567-e89b-12d3-a456-426614174000_report.pdf"
]
```

## 🔐 Security
+ API Key authentication in request headers (x-api-key).

+ Each API Key is associated with a specific folder (multi-tenancy).

## 📖 Future Improvements
+ Generate Signed URLs for AWS S3 secure access.
+ Restrict allowed file types via configuration.
+ Set a max file size limit configurable via .env.
+ Integration with DynamoDB or PostgreSQL to store file metadata.

## 👨‍💻 Author
Project developed by Rafa00716.

*Contributions and improvements are welcome! 🎉*

## 📜 License
This project is licensed under MIT. Feel free to use it, but credits are appreciated. 😊


🚀 **Let me know if you want any modifications or additions!** 😃🔥










