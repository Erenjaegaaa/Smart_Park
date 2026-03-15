from shapely.geometry import Polygon, Point

OCCUPANCY_THRESHOLD = 0.25

# Debounce: require N consecutive frames before changing state
DEBOUNCE_TO_FREE = 5     # frames before occupied -> free
DEBOUNCE_TO_OCCUPIED = 3  # frames before free -> occupied


def bbox_to_polygon(x1, y1, x2, y2):
    """Convert a YOLO bounding box to a Shapely Polygon."""
    return Polygon([(x1, y1), (x2, y1), (x2, y2), (x1, y2)])


def coords_to_polygon(coords):
    """Convert a list of [x, y] coordinate pairs to a Shapely Polygon."""
    return Polygon(coords)


def is_slot_occupied(slot_coords, detections):
    """
    Determine whether a parking slot is occupied by any detected vehicle.

    Two conditions trigger OCCUPIED:
    1. The vehicle bounding box center point falls inside the slot polygon.
    2. The intersection area between vehicle bbox and slot polygon is >= OCCUPANCY_THRESHOLD
       of the slot's total area.

    Args:
        slot_coords: List of [x, y] pairs defining the slot quadrilateral.
        detections:  List of (x1, y1, x2, y2) bounding boxes from YOLO.

    Returns:
        True if any vehicle occupies the slot, False otherwise.
    """
    slot_poly = coords_to_polygon(slot_coords)

    if not slot_poly.is_valid or slot_poly.area == 0:
        return False

    for (x1, y1, x2, y2) in detections:
        # Primary check: center point inside slot
        cx, cy = (x1 + x2) / 2, (y1 + y2) / 2
        if slot_poly.contains(Point(cx, cy)):
            return True

        # Secondary check: bbox overlap ratio >= threshold
        vehicle_poly = bbox_to_polygon(x1, y1, x2, y2)
        overlap_ratio = slot_poly.intersection(vehicle_poly).area / slot_poly.area
        if overlap_ratio >= OCCUPANCY_THRESHOLD:
            return True

    return False


# Per-slot debounce state: list of {confirmed: bool, counter: int}
_slot_debounce: list = []


def check_slots(car_boxes, slots):
    """
    Check which slots are occupied with debounce to prevent flickering.

    A slot only transitions occupied→free after DEBOUNCE_TO_FREE consecutive
    frames showing free, and free→occupied after DEBOUNCE_TO_OCCUPIED frames.
    """
    global _slot_debounce

    # Initialize debounce state on first call or if slot count changes
    if len(_slot_debounce) != len(slots):
        _slot_debounce = [{"confirmed": False, "counter": 0} for _ in slots]

    occupied = []
    for i, slot in enumerate(slots):
        x, y, w, h = slot["x"], slot["y"], slot["w"], slot["h"]
        coords = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]
        raw = is_slot_occupied(coords, car_boxes)

        db = _slot_debounce[i]

        if raw == db["confirmed"]:
            # Same as confirmed state — reset counter
            db["counter"] = 0
        else:
            # Different from confirmed — increment counter
            db["counter"] += 1
            threshold = DEBOUNCE_TO_FREE if db["confirmed"] else DEBOUNCE_TO_OCCUPIED
            if db["counter"] >= threshold:
                db["confirmed"] = raw
                db["counter"] = 0

        occupied.append(db["confirmed"])

    return occupied
