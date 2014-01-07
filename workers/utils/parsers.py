def parse_temp_value(system_result):
    return float(system_result.split("=")[1].split("'")[0])
