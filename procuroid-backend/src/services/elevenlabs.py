"""Helper utilities for launching ElevenLabs AI calls via Twilio."""

from __future__ import annotations

import os
from typing import Any, Dict, Optional
from urllib.parse import urlencode

from dotenv import load_dotenv
from twilio.rest import Client

load_dotenv()

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_FROM_NUMBER = os.getenv("TWILIO_FROM_NUMBER") or "+13262223398"
ELEVENLABS_TWILIO_ENDPOINT = os.getenv(
    "ELEVENLABS_TWILIO_ENDPOINT",
    "https://api.us.elevenlabs.io/twilio/inbound_call",
)


class ElevenLabsCallError(RuntimeError):
    """Error raised when initiating an ElevenLabs call fails."""


def _build_twilio_client() -> Client:
    if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN:
        raise ElevenLabsCallError(
            "Twilio credentials are not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN."
        )

    return Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)


def _build_inbound_url(metadata: Optional[Dict[str, Any]]) -> str:
    base_url = ELEVENLABS_TWILIO_ENDPOINT.rstrip("?")

    if not metadata:
        return base_url

    if not isinstance(metadata, dict):
        raise ElevenLabsCallError("metadata must be a JSON object/dict if provided.")

    query = urlencode({k: v for k, v in metadata.items() if v is not None}, doseq=True)
    return f"{base_url}?{query}" if query else base_url


def initiate_elevenlabs_call(
    to: str,
    *,
    agent_id: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Trigger an outbound call via Twilio that connects to the ElevenLabs Twilio endpoint."""

    if not to:
        raise ElevenLabsCallError("Destination phone number ('to') is required.")

    if not TWILIO_FROM_NUMBER:
        raise ElevenLabsCallError("TWILIO_FROM_NUMBER environment variable is not set.")

    twilio_client = _build_twilio_client()

    # Merge agent_id into metadata so it is forwarded to ElevenLabs as a query param
    merged_metadata: Optional[Dict[str, Any]]
    if metadata is None:
        merged_metadata = {"agent_id": agent_id} if agent_id else None
    else:
        merged_metadata = dict(metadata)
        if agent_id and "agent_id" not in merged_metadata:
            merged_metadata["agent_id"] = agent_id

    target_url = _build_inbound_url(merged_metadata)

    try:
        twilio_call = twilio_client.calls.create(
            to=to,
            from_=TWILIO_FROM_NUMBER,
            url=target_url,
        )
    except Exception as exc:  # noqa: BLE001
        raise ElevenLabsCallError(f"Failed to initiate ElevenLabs call via Twilio: {exc}") from exc

    return {
        "sid": twilio_call.sid,
        "status": twilio_call.status,
        "to": twilio_call.to,
        "from": twilio_call.from_,
        "uri": twilio_call.uri,
    }

