import utils


class CPUTemperatureTweeter(object):

    temperature_data = {}
    status_message = ""
    
    def __init__(self):
        self._get_temperature_data()
        self._build_status_message()
        self.twitter_client = self._connect_to_twitter()
        super(CPUTemperatureTweeter, self).__init__()

    def _connect_to_twitter(self):
        return utils.get_twitter_client()

    def _get_temperature_data(self):
        self.temperature_data = utils.get_latest_system_temperature()

    def _build_status_message(self):
        message_template = "My current CPU temperature is: {0} F/{1} C #raspberrypi"
        if self.temperature_data:
            celsius = self.temperature_data['celsius']
            fahrenheit = self.temperature_data['fahrenheit']
            self.status_message = message_template.format(fahrenheit, celsius)

    def tweet_it(self):
        if self.status_message:
            self.twitter_client.PostUpdate(self.status_message)
