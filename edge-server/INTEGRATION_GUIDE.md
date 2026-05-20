# Edge Server Integration Guide

## Overview
This edge server now integrates ESP32 camera streaming, vehicle detection using YOLOv8, and parking slot occupancy detection.

## New Features

### 1. **ESP32 Stream Support** (`fetch.py`)
- Connect to ESP32 camera via HTTP stream
- Real-time JPEG frame extraction
- Automatic reconnection on connection loss

**Configuration:**
- Edit `ESP32_URL` in `fetch.py` to match your ESP32 IP:
  ```python
  ESP32_URL = "http://192.168.4.1/stream"
  ```

### 2. **Vehicle Detection** (`detection/detector.py`)
- YOLOv8 nano model for vehicle detection
- Filters for vehicle classes only (car, motorcycle, bus, truck)
- **Vehicle Classes:** 2 (car), 3 (motorcycle), 5 (bus), 7 (truck)

### 3. **Parking Slot Management**

#### Drawing Slots (`slots/draw_slots.py`)
Define parking slots interactively using your camera feed.

**Usage:**
```bash
# Using local video file
python slots/draw_slots.py

# Using ESP32 stream
python slots/draw_slots.py esp32
```

**Controls:**
- **Left Click:** Define slot corners (2 clicks = 1 slot)
- **'s' key:** Save slots to `config/slots.json`
- **'q' key:** Quit without saving

#### Occupancy Detection (`slots/occupancy.py`)
Simple occupancy checker based on vehicle bounding box overlap:
- Marks a slot as occupied if vehicle overlap ≥ 20% of slot area
- Alternative to the advanced `slot_logic.py`

**Usage Example:**
```python
from slots.occupancy import load_slots, get_slot_status

slots = load_slots()
status = get_slot_status(slots, vehicle_boxes)
```

### 4. **Main Processing Loop** (`main.py`)

**Usage:**
```bash
# Using local video file
python main.py

# Using ESP32 stream
python main.py esp32
```

**Features:**
- Real-time vehicle detection every 5 frames
- Slot occupancy tracking with state management
- API updates to backend on changes
- Visual feedback (green=free, red=occupied)

## File Structure

```
edge-server/
├── fetch.py                          # ESP32 streaming module (NEW)
├── main.py                           # Main processing loop (UPDATED)
├── video/
│   └── video_source.py              # Video source abstraction (UPDATED)
├── detection/
│   └── detector.py                  # YOLO detection (UPDATED)
├── slots/
│   ├── draw_slots.py                # Slot drawing tool (UPDATED)
│   ├── occupancy.py                 # Simple occupancy checker (NEW)
│   ├── slot_logic.py                # Advanced occupancy logic
│   └── slot_state_manager.py        # State management
├── config/
│   ├── slots.json                   # Parking slot definitions
│   └── slot_status.json             # Current slot status
└── services/
    └── api_client.py                # Backend API client
```

## Requirements

Install dependencies:
```bash
pip install -r requirements.txt
```

**Updated requirements.txt includes:**
- `opencv-python`
- `ultralytics` (YOLO)
- `requests` (ESP32 streaming)
- `numpy`
- `shapely`

## Configuration

### ESP32 Stream Settings
Edit `fetch.py`:
```python
ESP32_URL = "http://192.168.4.1/stream"  # Change to your ESP32 IP
```

### Backend API Settings
Edit `services/api_client.py` to set your backend URL:
```python
API_URL = "http://localhost:5000"
```

### Slot Occupancy Threshold
**Simple Method (occupancy.py):** Modify the overlap percentage:
```python
if overlap / area > .2:  # 20% threshold
    occupied = True
```

**Advanced Method (slot_logic.py):** Modify `OCCUPANCY_THRESHOLD`:
```python
OCCUPANCY_THRESHOLD = 0.25  # 25% threshold
```

## Workflow

1. **Setup Parking Layout:**
   ```bash
   python slots/draw_slots.py esp32
   ```
   This creates `config/slots.json`

2. **Start Monitoring:**
   ```bash
   python main.py esp32
   ```
   Real-time slot occupancy detection and API updates

3. **Monitor via API:**
   - Backend receives updates in `config/slot_status.json`
   - Frontend polls backend for current status

## Switching Between Local Video and ESP32

**Two Options:**

1. **Command Line Argument:**
   ```bash
   python main.py          # Uses local video
   python main.py esp32    # Uses ESP32 stream
   ```

2. **Programmatic:**
   ```python
   from video.video_source import get_video_capture
   
   # Local video
   cap = get_video_capture(use_esp32=False)
   
   # ESP32 stream
   cap = get_video_capture(use_esp32=True)
   ```

## Troubleshooting

### ESP32 Connection Issues
- Verify ESP32 is powered and connected to WiFi
- Check ESP32 IP address matches `ESP32_URL`
- Test connection: `curl http://192.168.4.1/stream`

### Poor Detection
- Increase `conf` parameter in `detector.py` for fewer false positives
- Decrease `imgsz` for faster processing (less accurate)

### Slot Status Not Updating
- Verify `config/slots.json` exists and is valid
- Check backend API is running at configured URL
- Review logs in `config/slot_status.json`

## Performance Tips

- **ESP32:** Lower resolution = faster processing
- **Detection:** Run detector every N frames (currently 5)
- **GPU:** If available, enable GPU acceleration for YOLO:
  ```python
  model = YOLO(MODEL_PATH, device=0)  # device=0 for GPU
  ```

## API Integration

The system automatically sends updates to the backend:
```json
{
  "slot_id": 1,
  "occupied": true,
  "timestamp": "2026-05-19T10:30:45"
}
```

Backend should handle these updates in the `/api/slots/update` endpoint.
