import os
from ultralytics import YOLO

base_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(base_dir, "..", "yolov8s.pt")
model = YOLO(model_path)


def detect_vehicles(frame):
    # Low confidence needed — overhead view causes weak/misclassified detections
    results = model(frame, imgsz=960, conf=0.15, verbose=False)

    boxes = []
    for r in results:
        for box in r.boxes.xyxy:
            x1, y1, x2, y2 = map(int, box)
            boxes.append((x1, y1, x2, y2))

    return boxes
