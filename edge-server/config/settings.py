import os
from dotenv import load_dotenv

load_dotenv()

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:3000")
SLOT_UPDATE_ENDPOINT = f"{BACKEND_URL}/api/slots/internal/slot-update"