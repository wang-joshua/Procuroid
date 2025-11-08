# Agents Module

This folder contains AI agent-related routes and webhook handlers for procurement job processing.

## Architecture

The agents module exports a Flask blueprint (`agents_bp`) that is registered in the main Flask application at `src/main.py`.

## Running the Server

To run the backend with all modules (including agents):

```bash
cd procuroid-backend/src
python main.py
```

The server will start on `http://127.0.0.1:5000`

## Endpoints

All endpoints are served by the main Flask application on port 5000.

### Procurement Job Webhook
- **POST** `/webhook/procurement-job` - Receives procurement job updates

#### Request Format:
```json
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
```

#### Response:
```json
{
  "success": true,
  "message": "Webhook processed successfully",
  "record": {
    "id": 1,
    "product_name": "Docking Station",
    "quantity": 10
  },
  "metadata": {
    "type": "UPDATE",
    "table": "products",
    "has_old_record": true
  }
}
```

## Testing

### Using Python
```bash
python test_webhook.py
```

### Using PowerShell
```powershell
.\test_webhook.ps1
```

### Using curl (in PowerShell or Git Bash)
```bash
curl -X POST http://127.0.0.1:5000/webhook/procurement-job \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

## Notes

- The agents module is now integrated into the main Flask application
- Blueprint (`agents_bp`) is registered in `src/main.py`
- CORS is configured globally in the main app

