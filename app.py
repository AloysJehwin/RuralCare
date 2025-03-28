from flask import Flask, render_template, request, redirect, url_for, session, flash, Response
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from werkzeug.security import generate_password_hash, check_password_hash
import os
import matplotlib.pyplot as plt
import io
from twilio.rest import Client
import pandas as pd
import plotly.express as px
import plotly.io as pio
import dotenv as os

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")

app = Flask(__name__)
app.secret_key = os.urandom(24)

def authorize_google_sheets():
    scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
    creds = ServiceAccountCredentials.from_json_keyfile_name("test-run1-445517-f192122eafd1.json", scope)
    client = gspread.authorize(creds)
    return client.open('Health Data')

def get_or_create_user_sheet(username, name=None, age=None, height=None, weight=None, dob=None):
    sheet = authorize_google_sheets()
    try:
        worksheet = sheet.worksheet(username)
    except gspread.exceptions.WorksheetNotFound:
        worksheet = sheet.add_worksheet(title=username, rows="100", cols="8")
        worksheet.update('A1', [['Name']])
        worksheet.update('A2', [['Age']])
        worksheet.update('A3', [['Height']])
        worksheet.update('A4', [['Weight']])
        worksheet.update('A5', [['Date of Birth']])
        worksheet.update('B1', [[name]])
        worksheet.update('B2', [[age]])
        worksheet.update('B3', [[height]])
        worksheet.update('B4', [[weight]])
        worksheet.update('B5', [[dob]])
        worksheet.update('A7', [['Date']])
        worksheet.update('B7', [['HeartRate']])
        worksheet.update('C7', [['BloodPressure']])
        worksheet.update('D7', [['SPO2']])

    user_details = {
        'name': worksheet.cell(1, 2).value,
        'age': worksheet.cell(2, 2).value,
        'height': worksheet.cell(3, 2).value,
        'weight': worksheet.cell(4, 2).value,
        'dob': worksheet.cell(5, 2).value
    }
    return worksheet, user_details

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        name = request.form['name']
        age = request.form['age']
        height = request.form['height']
        weight = request.form['weight']
        dob = request.form['dob']

        hashed_password = generate_password_hash(password)
        sheet = authorize_google_sheets()
        worksheet = sheet.get_worksheet(0)
        worksheet.append_row([username, hashed_password, name, age, height, weight, dob])
        get_or_create_user_sheet(username, name, age, height, weight, dob)

        return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        sheet = authorize_google_sheets()
        worksheet = sheet.get_worksheet(0)
        users_data = worksheet.get_all_records()

        for user in users_data:
            if user['Username'] == username and check_password_hash(user['Password'], password):
                session['username'] = username
                return redirect(url_for('update_health_data'))

        flash('Invalid username or password!', 'danger')
    return render_template('login.html')

@app.route('/update_health_data', methods=['GET', 'POST'])
def update_health_data():
    if 'username' not in session:
        return redirect(url_for('login'))

    username = session['username']
    worksheet, user_details = get_or_create_user_sheet(username)

    if request.method == 'POST':
        date = request.form['date']
        heart_rate = request.form['heart_rate']
        blood_pressure = request.form['blood_pressure']
        spo2 = request.form['spo2']

        try:
            worksheet.append_row([date, heart_rate, blood_pressure, spo2])
            message_body = (
                f"Hello {user_details['name']},\n"
                f"Your health data has been successfully updated:\n"
                f"Date: {date}\nHeart Rate: {heart_rate} bpm\n"
                f"Blood Pressure: {blood_pressure}\nSPO2: {spo2}%"
            )
            client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
            client.messages.create(body=message_body, from_=TWILIO_PHONE_NUMBER, to='+919489254099')

            flash("Health data updated and SMS sent successfully!", "success")
        except Exception as e:
            flash(f"An error occurred: {str(e)}", "danger")

        return redirect(url_for('update_health_data'))
    return render_template('update_health_data.html', user_details=user_details)

# @app.route('/visualize_health_data')
# def visualize_health_data():
#     if 'username' not in session:
#         return redirect(url_for('login'))

#     # Get the username from the session
#     username = session['username']

#     # Fetch the user's personal worksheet using their username
#     worksheet, _ = get_or_create_user_sheet(username)

#     # Fetch the data for the user, skipping the header row (starting from row 8)
#     data = worksheet.get_all_records(head=7)  # Adjusting for the 7 header rows
#     if not data:
#         flash("No health data available to visualize.", "warning")
#         return redirect(url_for('update_health_data'))

#     # Extract health data from the worksheet
#     dates = [record['Date'] for record in data]
#     heart_rates = [record['HeartRate'] for record in data]
#     blood_pressures = [record['BloodPressure'] for record in data]
#     spo2_levels = [record['SPO2'] for record in data]

#     # Prepare the plot
#     plt.figure(figsize=(10, 6))
#     plt.plot(dates, heart_rates, label='Heart Rate', marker='o', color='r')
#     plt.plot(dates, blood_pressures, label='Blood Pressure', marker='o', color='b')
#     plt.plot(dates, spo2_levels, label='SPO2 Levels', marker='o', color='g')
#     plt.xlabel('Date')
#     plt.ylabel('Values')
#     plt.title(f'Health Data for {username} Over Time')
#     plt.xticks(rotation=45)
#     plt.legend()
#     plt.tight_layout()

#     # Save the plot to a buffer and return it as an image
#     buf = io.BytesIO()
#     plt.savefig(buf, format='png')
#     buf.seek(0)
#     plt.close()

@app.route('/visualize_health_data')
def display_graphs():
    if 'username' not in session:
        return redirect(url_for('login'))

    username = session['username']

    try:
        worksheet, _ = get_or_create_user_sheet(username)
        data = worksheet.get_all_records(head=7)
        if not data:
            flash("No health data available to display.", "warning")
            return redirect(url_for('update_health_data'))
    except Exception as e:
        flash(f"Error accessing health data: {str(e)}", "danger")
        return redirect(url_for('update_health_data'))

    try:
        df = pd.DataFrame(data)
        if df.empty:
            flash("No health data available to display.", "warning")
            return redirect(url_for('update_health_data'))
    except Exception as e:
        flash(f"Error processing health data: {str(e)}", "danger")
        return redirect(url_for('update_health_data'))

    required_columns = ['Date', 'HeartRate', 'BloodPressure', 'SPO2']
    if not all(col in df.columns for col in required_columns):
        flash("Health data is missing required columns.", "danger")
        return redirect(url_for('update_health_data'))

    try:
        heart_rate_fig = px.histogram(df, x="HeartRate", title="Heart Rate Distribution", nbins=10)
        blood_pressure_fig = px.box(df, y="BloodPressure", title="Blood Pressure Distribution")
        spo2_fig = px.bar(df, x="Date", y="SPO2", title="SPO2 Levels Over Time")

        heart_rate_html = pio.to_html(heart_rate_fig, full_html=False)
        blood_pressure_html = pio.to_html(blood_pressure_fig, full_html=False)
        spo2_html = pio.to_html(spo2_fig, full_html=False)
    except Exception as e:
        flash(f"Error creating visualizations: {str(e)}", "danger")
        return redirect(url_for('update_health_data'))

    return render_template(
        'visualize_health_data.html',
        heart_rate=heart_rate_html,
        blood_pressure=blood_pressure_html,
        spo2=spo2_html
    )

if __name__ == '__main__':
    app.run(debug=True)
