import subprocess

import utils


SHELL_COMMAND = ["/bin/df", "-BM"]
POST_URL = "http://127.0.0.1/api/system-storage-data"


def get_system_storage():
    system_result = subprocess.check_output(SHELL_COMMAND)
    system_storage = utils.parse_storage_values(system_result)
    return dict(system_storage)


def worker():
    storage_data = get_system_storage()
    post_status = utils.make_json_post(POST_URL, storage_data)
    if post_status != 201:
        # TODO: Add some logging when POST fails
        pass
    return


if __name__ == "__main__":
    worker()        
