import cv2
import json
import os
import sys

from video.video_source import get_video_capture
from detection.detector import detect_vehicles
from slots.slot_logic import check_slots
from slots.slot_state_manager import slotstatemanager
from services.api_client import apiclient

# Check if ESP32 mode is enabled via command line argument
USE_ESP32 = len(sys.argv) > 1 and sys.argv[1].lower() == "esp32"

api_client = apiclient("config/slot_status.json")

# Load slots
base_dir = os.path.dirname(os.path.abspath(__file__))
slots_path = os.path.join(base_dir, "config", "slots.json")

with open(slots_path, "r") as f:
    slots = json.load(f)

# INIT STATE MANAGER
state_manager = slotstatemanager(base_dir)

# Force initial API update with slot states
print("[MAIN] Sending initial slot states...")
initial_occupied = [False] * len(slots)
for i, slot_id in enumerate(range(1, len(slots) + 1)):
    api_client.send_update(slot_id, initial_occupied[i])

print(f"Starting with {'ESP32 stream' if USE_ESP32 else 'local video'}...")
cap = get_video_capture(use_esp32=USE_ESP32)   

while True:
    ret, frame = cap.read()
    if not ret:
        # Only reset for VideoCapture (local video), not ESP32Stream (continuous stream)
        if hasattr(cap, 'set'):
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
        continue

    car_boxes = detect_vehicles(frame)
    occupied = check_slots(car_boxes, slots)

    # Draw car detections
    for (x1, y1, x2, y2) in car_boxes:
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

    # Draw slots + update json state

    for i, slot in enumerate(slots):
        x, y, w, h = slot["x"], slot["y"], slot["w"], slot["h"]
        slot_id = i+1
        is_occupied = occupied[i]
        # Update state manager and JSON if there's a change and send update to server
        changed=state_manager.update_slot(slot_id,is_occupied)
        if changed:
            api_client.send_update(slot_id,is_occupied)
        color = (0, 0, 255) if occupied[i] else (0, 255, 0)
        label = f"Slot {i+1}: {'Occupied' if occupied[i] else 'Free'}"

        cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
        cv2.putText(frame, label, (x, y-5),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

    free_count = occupied.count(False)
    cv2.putText(frame, f"Free Slots: {free_count}",
                (20, 40), cv2.FONT_HERSHEY_SIMPLEX,
                1, (255, 255, 255), 2)

    cv2.imshow("Smart Parking System", frame)

    if cv2.waitKey(30) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
