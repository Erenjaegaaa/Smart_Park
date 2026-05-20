import cv2
import requests
import numpy as np
import threading
import time


ESP32_URL = "http://192.168.4.1/stream"


class ESP32Stream:

    def __init__(self):

        self.frame = None
        self.running = True

        thread = threading.Thread(
            target=self.update,
            daemon=True
        )

        thread.start()


    def update(self):

        while self.running:

            try:

                print(
                    "Connecting to ESP32..."
                )

                response = requests.get(
                    ESP32_URL,
                    stream=True,
                    timeout=30
                )

                data = b""

                for chunk in response.iter_content(
                        chunk_size=1024):

                    if not self.running:
                        break

                    data += chunk

                    a = data.find(
                        b'\xff\xd8'
                    )

                    b = data.find(
                        b'\xff\xd9'
                    )

                    if(
                        a != -1
                        and
                        b != -1
                    ):

                        jpg = data[a:b+2]

                        data = data[b+2:]

                        frame = cv2.imdecode(

                            np.frombuffer(
                                jpg,
                                dtype=np.uint8
                            ),

                            cv2.IMREAD_COLOR
                        )

                        if frame is not None:

                            self.frame = frame

            except Exception as e:

                print(
                    "Reconnect error:",
                    e
                )

                time.sleep(2)


    def read(self):

        if self.frame is None:

            return False, None

        return True, self.frame


    def release(self):

        self.running = False


def get_video_capture():

    return ESP32Stream()
