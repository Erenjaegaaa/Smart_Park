import json
import os
from datetime import datetime
class slotstatemanager:
    def __init__(self,base_dir):
        self.status_path=os.path.join(base_dir,"config","slot_status.json")
        with open(self.status_path,"r") as f:
            self.slot_status=json.load(f)
    def update_slot(self,slot_id,is_occupied):
        new_state="occupied" if is_occupied else "free"
        prev=self.slot_status.get(str(slot_id))
        if prev and prev["status"]==new_state:
            return False
        self.slot_status[str(slot_id)]={
            "status":new_state,
            "updated_at":datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        with open(self.status_path,"w") as f:
            json.dump(self.slot_status,f,indent=4)
        print(f"[STATE] Slot {slot_id} updated to {new_state}")
        return True