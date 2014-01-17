import subprocess

import utils


SHELL_COMMAND = ["/opt/vc/bin/vcgencmd", "get_config", "int"]
POST_URL = "http://127.0.0.1/api/system-config-data"


def get_system_config():
    system_result = subprocess.check_output(SHELL_COMMAND)
    system_config = utils.parse_config_values(system_result)
    config_dict = dict(system_config)
    config_dict['temp_limit'] = utils.celsius_to_fahrenheit(config_dict['temp_limit'])
    return config_dict


def worker():
    config_data = get_system_config()
    post_status = utils.make_json_post(POST_URL, config_data)
    if post_status != 201:
        # TODO: Add some logging when POST fails
        pass
    return    


if __name__ == "__main__":
    worker()
