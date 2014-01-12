def parse_temp_value(system_result):
    return float(system_result.split("=")[1].split("'")[0])


def parse_memory_values(system_result):
    result_lines = system_result.splitlines()
    header_list = result_lines[0].strip().split()
    data_list = result_lines[1].replace("Mem:", "").strip().split()
    return (header_list, data_list)
