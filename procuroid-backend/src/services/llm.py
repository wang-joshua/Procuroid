"""Utility functions for extracting structured data using an LLM."""

from __future__ import annotations

import json
import os
from typing import Any, Dict, Optional

import requests


LLM_EXTRACTION_ENDPOINT = os.getenv("LLM_EXTRACTION_ENDPOINT")
LLM_EXTRACTION_API_KEY = os.getenv("LLM_EXTRACTION_API_KEY")
LLM_EXTRACTION_MODEL = os.getenv("LLM_EXTRACTION_MODEL", "gpt-4o-mini")


def _call_llm(summary: str) -> Optional[Dict[str, Any]]:
    """Call the configured LLM endpoint to extract structured conclusions."""

    if not LLM_EXTRACTION_ENDPOINT or not summary:
        return None

    try:
        payload = {
            "model": LLM_EXTRACTION_MODEL,
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You are an assistant that extracts procurement call outcomes. "
                        "Return valid JSON with fields quoted_price, moq, terms_of_delivery, payment_terms, "
                        "meeting_requested, meeting_preferred_time, call_success, decision_reason, important_notes."
                    ),
                },
                {
                    "role": "user",
                    "content": (
                        "Extract the quoted price, minimum order quantity (moq), terms of delivery, "
                        "payment terms, whether the supplier requested a meeting (and any preferred time), "
                        "whether the supplier indicated they want to move forward with the deal, "
                        "their reason for accepting or declining, and any other important notes not already covered. "
                        "Respond with JSON in the format {\"quoted_price\": ..., \"moq\": ..., \"terms_of_delivery\": ..., \"payment_terms\": ..., \"meeting_requested\": ..., \"meeting_preferred_time\": ..., \"call_success\": ..., \"decision_reason\": ..., \"important_notes\": ...}.\n\n"
                        f"Call Summary:\n{summary}"
                    ),
                },
            ],
            "response_format": {
                "type": "json_schema",
                "json_schema": {
                    "name": "CallConclusion",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "quoted_price": {"type": ["string", "null"]},
                            "moq": {"type": ["string", "null"]},
                            "terms_of_delivery": {"type": ["string", "null"]},
                            "payment_terms": {"type": ["string", "null"]},
                            "meeting_requested": {"type": ["boolean", "null"]},
                            "meeting_preferred_time": {"type": ["string", "null"]},
                            "call_success": {"type": ["boolean", "null"]},
                            "decision_reason": {"type": ["string", "null"]},
                            "important_notes": {"type": ["string", "null"]},
                        },
                        "required": [
                            "quoted_price",
                            "moq",
                            "terms_of_delivery",
                            "payment_terms",
                            "meeting_requested",
                            "meeting_preferred_time",
                            "call_success",
                            "decision_reason",
                            "important_notes",
                        ],
                        "additionalProperties": False,
                    },
                },
            },
        }

        headers = {"Content-Type": "application/json"}
        if LLM_EXTRACTION_API_KEY:
            headers["Authorization"] = f"Bearer {LLM_EXTRACTION_API_KEY}"

        response = requests.post(
            LLM_EXTRACTION_ENDPOINT,
            json=payload,
            headers=headers,
            timeout=30,
        )
        response.raise_for_status()

        json_response = response.json()

        # Try to locate structured content regardless of provider format
        if isinstance(json_response, dict):
            if "output" in json_response and isinstance(json_response["output"], dict):
                return json_response["output"]
            if "choices" in json_response and json_response["choices"]:
                choice = json_response["choices"][0]
                message = choice.get("message") if isinstance(choice, dict) else None
                if isinstance(message, dict):
                    content = message.get("content")
                    if isinstance(content, str):
                        try:
                            return json.loads(content)
                        except Exception:  # noqa: BLE001
                            pass
                    elif isinstance(content, list):
                        for item in content:
                            if isinstance(item, dict) and item.get("type") == "json_schema":
                                return item.get("json")

        return json_response if isinstance(json_response, dict) else None
    except Exception as exc:  # noqa: BLE001
        print(f"LLM extraction failed: {exc}")
        return None


def extract_call_conclusion(summary: str) -> Dict[str, Optional[Any]]:
    """Use an LLM (with graceful fallback) to extract call conclusion data."""

    llm_result = _call_llm(summary)

    if isinstance(llm_result, dict):
        quoted_price = llm_result.get("quoted_price")
        moq = llm_result.get("moq")
        terms_of_delivery = llm_result.get("terms_of_delivery")
        payment_terms = llm_result.get("payment_terms")
        meeting_requested = llm_result.get("meeting_requested")
        meeting_preferred_time = llm_result.get("meeting_preferred_time")
        call_success = llm_result.get("call_success")
        decision_reason = llm_result.get("decision_reason")
        important_notes = llm_result.get("important_notes")
    else:
        quoted_price = moq = terms_of_delivery = payment_terms = None
        meeting_requested = meeting_preferred_time = call_success = None
        decision_reason = important_notes = None

    return {
        "quoted_price": quoted_price,
        "moq": moq,
        "terms_of_delivery": terms_of_delivery,
        "payment_terms": payment_terms,
        "meeting_requested": meeting_requested,
        "meeting_preferred_time": meeting_preferred_time,
        "call_success": call_success,
        "decision_reason": decision_reason,
        "important_notes": important_notes,
    }


