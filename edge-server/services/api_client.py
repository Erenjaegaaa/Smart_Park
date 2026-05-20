import json
import requests
from config.settings import SLOT_UPDATE_ENDPOINT

class apiclient:
    def __init__(self, status_path):
        self.status_path = status_path
        self.url = SLOT_UPDATE_ENDPOINT

    def send_update(self, slot_id, is_occupied):
        try:
            payload = {
                "slot_id": int(slot_id),
                "status": is_occupied
            }
            print(f"[API] Sending to {self.url}: {payload}")
            response = requests.post(
                self.url,
                json=payload,
                timeout=5
            )
            print(f"[API] Slot {slot_id} update sent - Response: {response.status_code}")
        except Exception as e:
            print("[API] Failed to send update: ", e)