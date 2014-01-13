import subprocess

import utils


SHELL_COMMAND = ["/bin/df", "-BM"]
POST_URL = "http://127.0.0.1/api/system-storage-data"
