# Flask App with Twilio Messaging and Google Sheets (GCP)

This Flask application integrates Twilio's messaging API to send SMS and uses Google Cloud Platform (GCP) credentials to interact with Google Sheets.

## Features
- Send SMS using Twilio API
- Read and write data to Google Sheets via GCP
- RESTful API with Flask

## Prerequisites
### Install Dependencies
Ensure you have Python installed (3.7+ recommended). Install the required dependencies:
```sh
pip install flask twilio google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

### Set Up Twilio
1. Create an account on [Twilio](https://www.twilio.com/).
2. Get your Twilio credentials from the Twilio Console:
   - **Account SID**
   - **Auth Token**
   - **Twilio Phone Number**
3. Save these in a `.env` file:
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

### Set Up Google Sheets API
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **Google Sheets API** and **Google Drive API**.
3. Create a service account and download the JSON key file.
4. Share your Google Sheet with the service account email.
5. Store the JSON key file in your project directory.
6. Set the environment variable:
```sh
export GOOGLE_APPLICATION_CREDENTIALS="path/to/your-key-file.json"
```

## Running the Flask App
Run the Flask server:
```sh
python app.py
```

### Sending an SMS
```sh
curl -X POST http://127.0.0.1:5000/send_sms -H "Content-Type: application/json" -d '{"to": "+1234567890", "message": "Hello from Flask!"}'
```

### Reading Google Sheets Data
```sh
curl -X GET http://127.0.0.1:5000/read_sheet
```

### Writing to Google Sheets
```sh
curl -X POST http://127.0.0.1:5000/write_sheet -H "Content-Type: application/json" -d '{"name": "John Doe", "email": "john@example.com", "phone": "+1234567890"}'
```

## Deployment
For production, use Gunicorn and set up an environment manager like Docker or a cloud platform (Heroku, AWS, GCP App Engine).

## License
This project is open-source under the MIT License.

