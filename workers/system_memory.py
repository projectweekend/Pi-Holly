import subprocess

import utils


SHELL_COMMAND = ["/usr/bin/free", "-h"]
POST_URL = "http://127.0.0.1/api/system-memory-data"


def get_system_memory():
    system_result = subprocess.check_output(SHELL_COMMAND)
    system_memory = utils.parse_memory_values(system_result)
    return dict(system_memory)


def worker():
    memory_data = get_system_memory()
    print(memory_data)
    # post_status = utils.make_json_post(POST_URL, memory_data)
    # if post_status != 201:
    #     # TODO: Add some logging when POST fails
    #     pass
    # return


if __name__ == "__main__":
    worker()
