from flask import Flask, render_template, request, jsonify
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/send_sms', methods=['POST'])
def send_sms():
    account_sid = request.form['account_sid']
    auth_token = request.form['auth_token']
    sender = request.form['sender']
    recipients = request.form['recipients'].split(',')
    message_body = request.form['message']

    client = Client(account_sid, auth_token)
    sent_messages = []

    for recipient in recipients:
        try:
            message_sent = client.messages.create(
                body=message_body,
                from_=sender,
                to=recipient
            )
            sent_messages.append({
                'number': recipient,
                'status': 'Terkirim',
                'message_id': message_sent.sid
            })
        except TwilioRestException as e:
            status = 'Tidak Valid' if e.code == 21614 else 'Gagal'
            sent_messages.append({
                'number': recipient,
                'status': status,
                'error': str(e)
            })

    return jsonify(sent_messages)

@app.route('/get_balance', methods=['POST'])
def get_balance():
    account_sid = request.form['account_sid']
    auth_token = request.form['auth_token']

    client = Client(account_sid, auth_token)
    balance = client.api.v2010.balance.fetch()
    usage = client.api.v2010.account.usage.records.today.list(category='sms')[0]

    return jsonify({
        'balance': balance.balance,
        'currency': balance.currency,
        'usage': usage.usage,
        'limit': usage.limit
    })

if __name__ == '__main__':
    app.run(debug=True)
