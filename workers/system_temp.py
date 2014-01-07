import subprocess
import json
import requests

import utils


SHELL_COMMAND = ["/opt/vc/bin/vcgencmd", "measure_temp"]


def get_system_temp():
    system_result = subprocess.check_output(SHELL_COMMAND)
    celsius_temp = utils.parse_temp_value(system_result)
    fahrenheit_temp = utils.celsius_to_fahrenheit(celsius_temp)
    return {'celsius':celsius_temp, 'fahrenheit': fahrenheit_temp}


def post_temp_data(temp_data):
    url = "http://holly.local/api/system-temperature-data"
    post_data = json.dumps(temp_data)
    headers = {'content-type': 'application/json'}
    response = requests.post(url, data=post_data, headers=headers)
    return response.status_code


# TODO: schedule a call to this in CRONTAB
def worker():
    temp_data = get_system_temp()
    post_status = post_temp_data(temp_data)
    if post_status != 201:
        # TODO: Add some logging when POST fails
        pass
    return

if __name__ == "__main__":
    worker()
