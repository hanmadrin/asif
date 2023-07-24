from datetime import datetime

from django.core.mail import EmailMessage

EMAIL_ADDRESS=""
EMAIL_APP_PASSWORD=""
FRONTEND_URL="http://127.0.0.1:3000/"
RECAPTCHA_PRIVATE_KEY = 'recaptcha_private_key'


class Util:

    @staticmethod
    def send_email(data):
        email = EmailMessage(
            to=[data['to_email']], subject=data['email_subject'], body=data['email_body'])
        email.send()


def convert_to_date(mm, dd, yy):
    year = yy[-2:]
    date_str = f"{mm.zfill(2)}-{dd.zfill(2)}-{year}"
    date_obj = datetime.strptime(date_str, "%m-%d-%y").date()
    return date_obj
