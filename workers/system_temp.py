import subprocess

import utils
from tweeting import CPUTemperatureTweeter


SHELL_COMMAND = ["/opt/vc/bin/vcgencmd", "measure_temp"]
POST_URL = "http://127.0.0.1/api/system-temperature-data"


def get_system_temp():
    system_result = subprocess.check_output(SHELL_COMMAND)
    celsius_temp = utils.parse_temp_value(system_result)
    fahrenheit_temp = utils.celsius_to_fahrenheit(celsius_temp)
    return {'celsius':celsius_temp, 'fahrenheit': fahrenheit_temp}


def worker():
    temp_data = get_system_temp()
    post_status = utils.make_json_post(POST_URL, temp_data)
    if post_status != 201:
        # TODO: Add some logging when POST fails
        pass
    else:
        tweeter = CPUTemperatureTweeter()
        tweeter.tweet_it()
        return

if __name__ == "__main__":
    worker()
