import os
from ultralytics import YOLO

base_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(base_dir, "..", "yolov8n.pt")
model = YOLO(model_path)

# COCO class IDs for vehicle detection
# 2: car, 3: motorcycle, 4: airplane, 5: bus, 7: truck
VEHICLE_CLASSES = [2, 3, 4, 5, 7]


def detect_vehicles(frame):
    """
    Detect vehicles in the frame using YOLOv8.
    
    Args:
        frame: Input frame from video source
        
    Returns:
        List of bounding boxes in format (x1, y1, x2, y2)
    """
    if frame is None:
        return []
    
    # Nano model with reduced imgsz for faster inference
    results = model(frame, imgsz=480, conf=0.1, verbose=False)

    boxes = []
    for r in results:
        for i, (box, cls) in enumerate(zip(r.boxes.xyxy, r.boxes.cls)):
            class_id = int(cls)
            
            # Only include vehicle classes
            if class_id not in VEHICLE_CLASSES:
                continue
            
            x1, y1, x2, y2 = map(int, box[:4])
            boxes.append((x1, y1, x2, y2))

    return boxes
