from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
import pyotp
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
CORS(app) 

EMAIL_HOST = 'outlook.office365.com'
EMAIL_PORT = 587
EMAIL_USER = ''  
EMAIL_PASS = '' 

def send_pin_via_email(email, pin):
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_USER
        msg['To'] = email
        msg['Subject'] = 'Seu PIN de acesso'

        body = f'Olá,\n\nSeu PIN de acesso é: {pin}\nAtenciosamente,\nInovação'           
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)

        server.sendmail(EMAIL_USER, email, msg.as_string())
        server.quit()

        print(f"PIN enviado com sucesso para {email}")
    except Exception as e:
        print(f"Falha ao enviar email: {e}")

def generate_pin():
    totp = pyotp.TOTP(pyotp.random_base32(), interval=300)  
    return totp.now()

@app.route('/send_pin', methods=['POST'])
def send_pin():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email é obrigatório!'}), 400
    
    pin = generate_pin()

    send_pin_via_email(email, pin)

    return jsonify({'message': 'PIN enviado com sucesso para seu email!'}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    pin = data.get('pin')

    if not email or not pin:
        return jsonify({'error': 'Email e PIN são obrigatórios!'}), 400

    # Suponha que o PIN seja válido
    return jsonify({'message': 'Login realizado com sucesso!', 'token': 'token_exemplo'}), 200

if __name__ == '__main__':
    app.run(debug=False)
