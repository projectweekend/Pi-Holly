import subprocess
import json
import requests

import utils


SHELL_COMMAND = ["/opt/vc/bin/vcgencmd", "measure_temp"]
POST_URL = "http://holly.local/api/system-temperature-data"


def get_system_temp():
    system_result = subprocess.check_output(SHELL_COMMAND)
    celsius_temp = utils.parse_temp_value(system_result)
    fahrenheit_temp = utils.celsius_to_fahrenheit(celsius_temp)
    return {'celsius':celsius_temp, 'fahrenheit': fahrenheit_temp}


# TODO: schedule a call to this in CRONTAB
def worker():
    temp_data = get_system_temp()
    post_status = utils.make_json_post(POST_URL, temp_data)
    if post_status != 201:
        # TODO: Add some logging when POST fails
        pass
    return

if __name__ == "__main__":
    worker()
