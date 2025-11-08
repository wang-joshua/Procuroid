import os
import requests
from dotenv import load_dotenv
from supabase import create_client, Client
from typing import Optional, Dict, List, Any

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase_url: str = os.getenv("SUPABASE_URL", "")
supabase_key: str = os.getenv("SUPABASE_KEY", "")
supabase_service_key: str = os.getenv("SUPABASE_SERVICE_KEY", "")

# Create Supabase client instance with anon key for public operations
# Only create clients if credentials are provided, otherwise they'll be None
try:
    if supabase_url and supabase_key:
        supabase: Client = create_client(supabase_url, supabase_key)
    else:
        supabase = None
        print("Warning: SUPABASE_URL and SUPABASE_KEY not set. Authentication features will be disabled.")
except Exception as e:
    print(f"Warning: Failed to create Supabase client: {e}")
    supabase = None

try:
    if supabase_url and supabase_service_key:
        supabase_admin: Client = create_client(supabase_url, supabase_service_key)
    else:
        supabase_admin = None
except Exception as e:
    print(f"Warning: Failed to create Supabase admin client: {e}")
    supabase_admin = None


def verify_user_token(token: str) -> Optional[dict]:
    """
    Verify a user's JWT token and return their user information.
    
    Args:
        token: The JWT token from the Authorization header
        
    Returns:
        dict: User information if token is valid, None otherwise
    """
    try:
        if not supabase:
            print("Supabase client not initialized")
            return None
        
        # Verify the JWT token using Supabase
        response = supabase.auth.get_user(token)
        
        if response.user:
            return {
                "id": response.user.id,
                "email": response.user.email,
                "user_metadata": response.user.user_metadata,
            }
        return None
    except Exception as e:
        print(f"Token verification error: {e}")
        return None


def get_user_by_id(user_id: str) -> Optional[dict]:
    """
    Get user information by user ID using admin client.
    
    Args:
        user_id: The Supabase user ID
        
    Returns:
        dict: User information if found, None otherwise
    """
    try:
        response = supabase_admin.auth.admin.get_user_by_id(user_id)
        if response.user:
            return {
                "id": response.user.id,
                "email": response.user.email,
                "user_metadata": response.user.user_metadata,
            }
        return None
    except Exception as e:
        print(f"Error fetching user: {e}")
        return None


def sign_up_user(email: str, password: str, user_metadata: Optional[dict] = None) -> dict:
    """
    Sign up a new user with email and password.
    
    Args:
        email: User's email address
        password: User's password
        user_metadata: Optional metadata dictionary (e.g., first_name, last_name)
        
    Returns:
        dict: Response with user and session data or error message
    """
    try:
        if not supabase:
            return {"success": False, "error": "Supabase client not initialized"}
        
        # Build the sign up payload with metadata if provided
        sign_up_payload = {
            "email": email,
            "password": password,
        }
        
        if user_metadata:
            sign_up_payload["options"] = {"data": user_metadata}
        
        response = supabase.auth.sign_up(sign_up_payload)
        
        if response.user:
            return {
                "success": True,
                "user": {
                    "id": response.user.id,
                    "email": response.user.email,
                    "user_metadata": response.user.user_metadata,
                },
                "message": "User created successfully. Check your email to confirm your account."
            }
        return {"success": False, "error": "Failed to create user"}
    except Exception as e:
        print(f"Sign up error: {e}")
        return {"success": False, "error": str(e)}


def sign_in_user(email: str, password: str) -> dict:
    """
    Sign in an existing user with email and password.
    
    Args:
        email: User's email address
        password: User's password
        
    Returns:
        dict: Response with user, session (including access_token) or error message
    """
    try:
        if not supabase:
            return {"success": False, "error": "Supabase client not initialized"}
        
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password,
        })
        
        if response.user and response.session:
            return {
                "success": True,
                "user": {
                    "id": response.user.id,
                    "email": response.user.email,
                    "user_metadata": response.user.user_metadata,
                },
                "session": {
                    "access_token": response.session.access_token,
                    "refresh_token": response.session.refresh_token,
                    "expires_at": response.session.expires_at,
                    "expires_in": response.session.expires_in,
                }
            }
        return {"success": False, "error": "Invalid credentials"}
    except Exception as e:
        print(f"Sign in error: {e}")
        return {"success": False, "error": str(e)}


def create_procurement_job(user_id: str, job_info: dict, expires_at: Optional[str] = None) -> dict:
    """
    Create a new procurement job in the procurement_jobs table.
    
    Args:
        user_id: The user's UUID
        job_info: The full job details as JSON
        expires_at: Optional expiration timestamp (defaults to now + 30 minutes)
        
    Returns:
        dict: Response with job data or error message
    """
    try:
        if not supabase_admin:
            return {"success": False, "error": "Supabase admin client not initialized"}
        
        # Prepare the job data
        job_data = {
            "user_id": user_id,
            "job_info": job_info,
            "status": "pending"
        }
        
        # Add expires_at if provided
        if expires_at:
            job_data["expires_at"] = expires_at
        
        # Insert into procurement_jobs table using admin client to bypass RLS
        response = supabase_admin.table("procurement_jobs").insert(job_data).execute()
        
        if response.data and len(response.data) > 0:
            return {
                "success": True,
                "job": response.data[0]
            }
        return {"success": False, "error": "Failed to create job"}
    except Exception as e:
        print(f"Create procurement job error: {e}")
        return {"success": False, "error": str(e)}


def get_procurement_jobs(user_id: str, status: Optional[str] = None) -> dict:
    """
    Get procurement jobs for a user, optionally filtered by status.
    
    Args:
        user_id: The user's UUID
        status: Optional status filter
        
    Returns:
        dict: Response with jobs or error message
    """
    try:
        if not supabase_admin:
            return {"success": False, "error": "Supabase admin client not initialized"}
        
        query = supabase_admin.table("procurement_jobs").select("*").eq("user_id", user_id)
        
        if status:
            query = query.eq("status", status)
        
        response = query.execute()
        
        return {
            "success": True,
            "jobs": response.data
        }
    except Exception as e:
        print(f"Get procurement jobs error: {e}")
        return {"success": False, "error": str(e)}


def update_procurement_job(job_id: str, updates: dict) -> dict:
    """
    Update a procurement job.
    
    Args:
        job_id: The job UUID
        updates: Dictionary of fields to update
        
    Returns:
        dict: Response with updated job data or error message
    """
    try:
        if not supabase_admin:
            return {"success": False, "error": "Supabase admin client not initialized"}
        
        response = supabase_admin.table("procurement_jobs").update(updates).eq("id", job_id).execute()
        
        if response.data and len(response.data) > 0:
            return {
                "success": True,
                "job": response.data[0]
            }
        return {"success": False, "error": "Failed to update job"}
    except Exception as e:
        print(f"Update procurement job error: {e}")
        return {"success": False, "error": str(e)}


def call_quotation_agent(procurement_jobs: List[Dict[str, Any]]) -> dict:
    """
    Call the ElevenLabs Quotation Agent for each procurement job.
    
    Args:
        procurement_jobs: List of procurement job objects, each containing:
            - id: Job UUID
            - seller_company_info: Dict with seller_company_name
            - buyer_company_info: Dict with buyer_company_name
            - job_info: Dict with job details
    
    Returns:
        dict: Response with success status and any errors
    """
    try:
        # Get ElevenLabs Quotation Agent URL from environment
        quotation_agent_url = os.getenv("ELEVENLABS_QUOTATION_AGENT_URL")
        
        if not quotation_agent_url:
            return {"success": False, "error": "ELEVENLABS_QUOTATION_AGENT_URL not configured"}
        
        results = []
        errors = []
        
        for job in procurement_jobs:
            job_id = job.get("id")
            if not job_id:
                errors.append({"job": job, "error": "Missing job id"})
                continue
            
            try:
                # Extract required information
                seller_company_name = job.get("seller_company_info", {}).get("seller_company_name")
                buyer_company_name = job.get("buyer_company_info", {}).get("buyer_company_name")
                job_info = job.get("job_info", {})
                
                if not seller_company_name or not buyer_company_name:
                    errors.append({
                        "job_id": job_id,
                        "error": "Missing seller_company_name or buyer_company_name"
                    })
                    continue
                
                # Get webhook URL for callback (where ElevenLabs will send the result)
                webhook_base_url = os.getenv("WEBHOOK_BASE_URL", "http://localhost:5000")
                webhook_url = f"{webhook_base_url}/quotation-agent/webhook"
                
                # Prepare payload for ElevenLabs Quotation Agent
                agent_payload = {
                    "job_id": job_id,
                    "seller_company_name": seller_company_name,
                    "buyer_company_name": buyer_company_name,
                    "job_info": job_info,
                    "webhook_url": webhook_url  # URL where ElevenLabs will POST the output_result
                }
                
                # Call ElevenLabs Quotation Agent API
                response = requests.post(
                    quotation_agent_url,
                    json=agent_payload,
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {os.getenv('ELEVENLABS_API_KEY', '')}"
                    },
                    timeout=300  # 5 minute timeout for long-running calls
                )
                
                if response.status_code == 200 or response.status_code == 202:
                    # Agent accepted the request (202 = accepted, 200 = immediate result)
                    result_data = response.json() if response.text else {}
                    
                    # If the agent returns output_result immediately, update the job
                    if "output_result" in result_data:
                        update_result = update_procurement_job(job_id, {
                            "output_result": result_data["output_result"],
                            "status": "completed"
                        })
                        if not update_result.get("success"):
                            errors.append({
                                "job_id": job_id,
                                "error": f"Failed to update job: {update_result.get('error')}"
                            })
                    
                    results.append({
                        "job_id": job_id,
                        "status": "accepted",
                        "message": "Quotation agent processing"
                    })
                else:
                    errors.append({
                        "job_id": job_id,
                        "error": f"Agent API returned status {response.status_code}: {response.text}"
                    })
                    
            except requests.exceptions.RequestException as e:
                errors.append({
                    "job_id": job_id,
                    "error": f"Network error calling quotation agent: {str(e)}"
                })
            except Exception as e:
                errors.append({
                    "job_id": job_id,
                    "error": f"Error processing job: {str(e)}"
                })
        
        return {
            "success": len(errors) == 0,
            "results": results,
            "errors": errors if errors else None
        }
        
    except Exception as e:
        print(f"Call quotation agent error: {e}")
        return {"success": False, "error": str(e)}


def get_suppliers(page: int = 1, page_size: int = 10, search: Optional[str] = None) -> dict:
    """
    Get suppliers from supplier table with pagination and optional search.
    
    Args:
        page: Page number (1-indexed)
        page_size: Number of items per page (default 10, max 100)
        search: Optional search term to filter by supplier name or other fields
        
    Returns:
        dict: Response with suppliers, pagination metadata, or error message
    """
    try:
        if not supabase_admin:
            return {"success": False, "error": "Supabase admin client not initialized"}
        
        # Validate and limit page_size
        page_size = min(max(1, page_size), 100)
        page = max(1, page)
        
        # Calculate offset
        offset = (page - 1) * page_size
        
        # Build query
        query = supabase_admin.table("suppliers").select("*", count="exact")
        
        # Add search filter if provided (adjust column names as needed)
        if search:
            # Search across common supplier fields
            query = query.or_(f"supplier_name.ilike.%{search}%,contact_email.ilike.%{search}%,company_name.ilike.%{search}%")
        
        # Apply pagination
        query = query.range(offset, offset + page_size - 1)
        
        # Execute query
        response = query.execute()
        
        # Calculate total pages
        total_count = response.count if hasattr(response, 'count') and response.count else len(response.data)
        total_pages = (total_count + page_size - 1) // page_size if total_count > 0 else 0
        
        return {
            "success": True,
            "suppliers": response.data,
            "pagination": {
                "page": page,
                "page_size": page_size,
                "total_count": total_count,
                "total_pages": total_pages,
                "has_next": page < total_pages,
                "has_previous": page > 1
            }
        }
    except Exception as e:
        print(f"Get suppliers error: {e}")
        return {"success": False, "error": str(e)}
