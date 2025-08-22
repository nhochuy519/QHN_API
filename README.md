## Cách chạy dự án

1. Clone repo:
   ```bash
   git clone https://github.com/nhochuy519/QHN_API.git
2. Navigate to the project folder
  cd QHN_API
3. Install dependencies
   npm i
4. Set up environment variables
  DATABASE =mongodb+srv://huy:123@cluster0.cwrqasn.mongodb.net/shopWeb?retryWrites=true&w=majority&appName=Cluster0
  PORT=8000
  JWT_SECRET='your secret key'
  JWT_EXPIRES_IN=1d
  EMAIL_USERNAME – Your email address used to send reset password emails  
  EMAIL_PASSWORD – The app-specific password or token for the above email account

5. Start the server
   npm run dev

