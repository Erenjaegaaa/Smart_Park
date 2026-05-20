import cv2
import os
import sys


def get_video_capture(use_esp32=False):
    """
    Get video capture from either ESP32 stream or local video file.
    
    Args:
        use_esp32 (bool): If True, use ESP32 stream. If False, use local video file.
    
    Returns:
        Video capture object (either OpenCV VideoCapture or ESP32Stream)
    """
    if use_esp32:
        # Import ESP32Stream from fetch.py
        parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        sys.path.insert(0, parent_dir)
        from fetch import ESP32Stream
        return ESP32Stream()
    else:
        # Use local video file (default)
        base_dir = os.path.dirname(os.path.abspath(__file__))
        video_path = os.path.join(base_dir, "..", "videos", "parking_video.mp4")

        cap = cv2.VideoCapture(video_path)

        if not cap.isOpened():
            raise RuntimeError("ERROR: Unable to open video source")

        return cap
