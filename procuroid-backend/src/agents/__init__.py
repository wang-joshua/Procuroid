from flask import Blueprint, request, jsonify

# Create a blueprint for agent routes
agents_bp = Blueprint('agents', __name__)


@agents_bp.route("/webhook/procurement-job", methods=["POST"])
def procurement_job_webhook():
    """
    Webhook endpoint to receive procurement job updates.
    Expected payload format:
    {
        "type": "UPDATE",
        "table": "products",
        "record": {
            "id": 1,
            "product_name": "Docking Station",
            "quantity": 10
        },
        "old_record": {
            "id": 1,
            "product_name": "Dock Station",
            "quantity": 8
        }
    }
    """
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    # Extract the record from the payload
    record = data.get("record")
    
    if not record:
        return jsonify({"error": "Missing 'record' field in payload"}), 400
    
    # Extract additional metadata
    webhook_type = data.get("type")
    table = data.get("table")
    old_record = data.get("old_record")
    
    # Log the extracted record for debugging
    print(f"Webhook received - Type: {webhook_type}, Table: {table}")
    print(f"Record extracted: {record}")
    
    # Return the extracted record
    return jsonify({
        "success": True,
        "message": "Webhook processed successfully",
        "record": record,
        "metadata": {
            "type": webhook_type,
            "table": table,
            "has_old_record": old_record is not None
        }
    }), 200

