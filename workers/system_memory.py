import subprocess

import utils


SHELL_COMMAND = ["/usr/bin/free", "-h"]


def get_system_memory():
    system_result = subprocess.check_output(SHELL_COMMAND)
    system_memory = utils.parse_memory_values(system_result)
    return dict(system_memory)


def worker():
    memory_data = get_system_memory()
    memory_data_collection = utils.get_collection('systemmemorydatas')
    memory_data_collection.insert(memory_data)


if __name__ == "__main__":
    worker()
