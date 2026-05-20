import json
import os


BASE_DIR = os.path.dirname(os.path.abspath(__file__))


SLOT_FILE = os.path.join(
    BASE_DIR,
    "..",
    "config",
    "slots.json"
)


def load_slots():
    """Load parking slots from JSON configuration file."""
    with open(
            SLOT_FILE,
            "r"
    ) as f:

        return json.load(f)


def intersection(a, b):
    """
    Calculate intersection area between two rectangular bounding boxes.
    
    Args:
        a: Tuple (x1, y1, x2, y2) for first box
        b: Tuple (x1, y1, x2, y2) for second box
    
    Returns:
        Intersection area
    """
    ax1, ay1, ax2, ay2 = a
    bx1, by1, bx2, by2 = b

    x = max(ax1, bx1)
    y = max(ay1, by1)

    xx = min(ax2, bx2)
    yy = min(ay2, by2)

    if xx < x or yy < y:
        return 0

    return (
        (xx - x)
        *
        (yy - y)
    )


def get_slot_status(
        slots,
        vehicles
):
    """
    Determine occupancy status of parking slots.
    
    Args:
        slots: List of slot dictionaries with x, y, w, h coordinates
        vehicles: List of vehicle bounding boxes (x1, y1, x2, y2)
        
    Returns:
        List of boolean values indicating slot occupancy
    """
    result = []

    for slot in slots:

        sx1 = slot["x"]
        sy1 = slot["y"]

        sx2 = sx1 + slot["w"]
        sy2 = sy1 + slot["h"]

        area = (
            slot["w"]
            *
            slot["h"]
        )

        occupied = False

        for v in vehicles:

            overlap = intersection(

                (
                    sx1,
                    sy1,
                    sx2,
                    sy2
                ),

                v
            )

            # If overlap >= 20% of slot area, mark as occupied
            if overlap / area > .2:

                occupied = True
                break

        result.append(
            occupied
        )

    return result
