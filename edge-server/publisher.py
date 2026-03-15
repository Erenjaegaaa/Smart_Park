import logging
import time
from typing import Dict

import requests
from requests.exceptions import ConnectionError, RequestException, Timeout

logger = logging.getLogger(__name__)


class SlotPublisher:
    """
    Publishes full parking slot state to the backend internal API.

    Responsibilities:
    - POST full slot state JSON to POST /api/internal/slot-update.
    - Authenticate via X-Internal-Secret header (never JWT).
    - Retry up to max_retries times with exponential backoff (2 s, 4 s, …).
    - On total failure: log error and return False — never raise, never crash the
      detection loop.
    """

    def __init__(
        self,
        backend_url: str,
        internal_secret: str,
        max_retries: int = 3,
        timeout: int = 5,
    ):
        """
        Args:
            backend_url:     Base URL of the backend, e.g. "http://localhost:3000".
            internal_secret: Shared secret sent as X-Internal-Secret header.
            max_retries:     Maximum POST attempts before giving up (default 3).
            timeout:         Per-request timeout in seconds (default 5).
        """
        self.endpoint = f"{backend_url.rstrip('/')}/api/internal/slot-update"
        self.internal_secret = internal_secret
        self.max_retries = max_retries
        self.timeout = timeout

        logger.info(
            "SlotPublisher initialised — endpoint=%s, max_retries=%d, timeout=%ds",
            self.endpoint,
            self.max_retries,
            self.timeout,
        )

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def send(self, slot_state: Dict) -> bool:
        """
        Send the full slot state to the backend.

        The payload must conform to:
        {
            "timestamp": "<ISO-8601>",
            "slots": [
                {"slot_id": 1, "status": "occupied"},
                {"slot_id": 2, "status": "free"}
            ]
        }

        Args:
            slot_state: Full state dict produced by SlotStateManager.get_full_state().

        Returns:
            True if the backend acknowledged with HTTP 200, False otherwise.
        """
        headers = {
            "Content-Type": "application/json",
            "X-Internal-Secret": self.internal_secret,
        }

        for attempt in range(1, self.max_retries + 1):
            try:
                logger.info(
                    "Publishing slot update (attempt %d/%d)…",
                    attempt,
                    self.max_retries,
                )

                response = requests.post(
                    self.endpoint,
                    json=slot_state,
                    headers=headers,
                    timeout=self.timeout,
                )

                if response.status_code == 200:
                    logger.info("Slot update accepted by backend (attempt %d)", attempt)
                    return True

                # Auth failures are permanent — retrying won't help
                if response.status_code in (401, 403):
                    logger.error(
                        "Backend rejected request with %d — check INTERNAL_SECRET. "
                        "Aborting retries.",
                        response.status_code,
                    )
                    return False

                logger.warning(
                    "Backend returned HTTP %d on attempt %d: %s",
                    response.status_code,
                    attempt,
                    response.text[:200],
                )

            except Timeout:
                logger.warning(
                    "Request timed out after %ds (attempt %d/%d)",
                    self.timeout,
                    attempt,
                    self.max_retries,
                )

            except ConnectionError as exc:
                logger.warning(
                    "Connection error on attempt %d/%d: %s",
                    attempt,
                    self.max_retries,
                    exc,
                )

            except RequestException as exc:
                logger.warning(
                    "Request error on attempt %d/%d: %s",
                    attempt,
                    self.max_retries,
                    exc,
                )

            except Exception as exc:  # noqa: BLE001
                logger.error(
                    "Unexpected error on attempt %d/%d: %s: %s",
                    attempt,
                    self.max_retries,
                    type(exc).__name__,
                    exc,
                )
                # Unexpected errors are not retried
                return False

            # Wait before next attempt (skip sleep after the last attempt)
            if attempt < self.max_retries:
                backoff = 2 ** attempt  # 2 s, 4 s
                logger.info("Retrying in %ds…", backoff)
                time.sleep(backoff)

        logger.error(
            "All %d attempts to publish slot update failed — backend may be unreachable.",
            self.max_retries,
        )
        return False
