import subprocess

import utils


SHELL_COMMAND = ["/opt/vc/bin/vcgencmd", "measure_temp"]


def get_system_temp():
    system_result = subprocess.check_output(SHELL_COMMAND)
    celsius_temp = utils.parse_temp_value(system_result)
    fahrenheit_temp = utils.celsius_to_fahrenheit(celsius_temp)
    return {'celsius':celsius_temp, 'fahrenheit': fahrenheit_temp}


def system_temp_worker():
    return get_system_temp()
