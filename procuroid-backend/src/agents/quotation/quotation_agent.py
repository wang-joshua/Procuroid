"""
QuotationAgent: Contacts individual suppliers via voice calls using ElevenLabs.
Handles three response types: Yes (quotation), No (declined), Schedule Meeting.
"""

import asyncio
from typing import Dict, Literal
from datetime import datetime
import json
import os

# Import necessary clients
from google import genai
from elevenlabs import ElevenLabs, VoiceSettings
from supabase import create_client, Client

# Initialize clients (these should be imported from a config file in production)
genai_client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
elevenlabs_client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)


class QuotationAgent:
    """
    Individual agent responsible for contacting ONE supplier and getting a quotation.
    Uses ElevenLabs for voice synthesis and handles supplier responses.
    
    Each QuotationAgent is spawned by the ParallelAgent and runs independently.
    """
    
    def __init__(self, supplier: Dict):
        """
        Initialize the agent with supplier information.
        
        Args:
            supplier: Dictionary containing supplier details (id, name, phone, email, etc.)
        """
        self.supplier = supplier
        self.supplier_id = supplier['id']
        self.supplier_name = supplier['name']
        self.supplier_phone = supplier.get('phone')
        self.supplier_email = supplier.get('email')
        
        # ElevenLabs voice configuration
        self.voice_id = "21m00Tcm4TlvDq8ikWAM"  # Professional male voice (Rachel is also good)
        
        print(f"QuotationAgent initialized for: {self.supplier_name}")
    
    async def request_quotation(self, product_details: Dict) -> Dict:
        """
        Main method: Contact the supplier and request a quotation.
        
        This method:
        1. Generates a voice call script
        2. Creates audio using ElevenLabs
        3. Makes the call (or simulates it)
        4. Processes the supplier's response
        5. Saves everything to Supabase
        
        Returns:
            Dictionary with quotation data or meeting request or decline reason
        """
        
        print(f"  📞 QuotationAgent calling: {self.supplier_name}...")
        
        try:
            # Step 1: Generate the call script
            call_script = self._generate_call_script(product_details)
            
            # Step 2: Create voice audio using ElevenLabs
            audio_file = await self._generate_voice_audio(call_script)
            
            # Step 3: Make the call and get response
            # In production: Use Twilio to make actual call + Speech-to-Text for response
            # For now: Simulate intelligent supplier response
            supplier_response = await self._get_supplier_response(product_details)
            
            # Step 4: Save call log to Supabase
            await self._save_call_log(product_details, audio_file, supplier_response)
            
            # Step 5: Process response based on type
            result = await self._process_response(supplier_response, product_details)
            
            # Log result
            status_emoji = {
                'quotation_received': '✅',
                'declined': '❌',
                'meeting_requested': '📅',
                'error': '⚠️'
            }
            emoji = status_emoji.get(result['status'], '❓')
            print(f"  {emoji} {self.supplier_name}: {result['status']}")
            
            return result
            
        except Exception as e:
            print(f"  ❌ {self.supplier_name}: Error - {str(e)}")
            return {
                'supplier_id': self.supplier_id,
                'supplier_name': self.supplier_name,
                'status': 'error',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def _generate_call_script(self, product_details: Dict) -> str:
        """
        Generate the script for the voice call to the supplier.
        This is what ElevenLabs will convert to speech.
        """
        
        script = f"""
        Hello, this is an automated procurement call from Procuroid.
        
        We are requesting a quotation for the following product:
        
        Product: {product_details.get('product_description', 'Not specified')}
        Quantity: {product_details.get('quantity', 'Not specified')}
        
        """
        
        # Add specifications if available
        if 'specifications' in product_details:
            script += "Specifications:\n"
            for key, value in product_details['specifications'].items():
                script += f"- {key}: {value}\n"
        
        # Add delivery requirements
        if 'delivery_deadline' in product_details:
            script += f"\nRequired delivery by: {product_details['delivery_deadline']}\n"
        
        script += """
        
        Can you provide a quotation for this order?
        
        Please respond with:
        - Yes, if you can provide a quote immediately
        - No, if you cannot fulfill this order
        - Schedule a meeting, if you would like to discuss the details first
        
        Thank you for your time.
        """
        
        return script
    
    async def _generate_voice_audio(self, script: str) -> str:
        """
        Generate voice audio using ElevenLabs Text-to-Speech.
        
        Returns:
            Filename of the generated audio file
        """
        
        try:
            # Generate audio using ElevenLabs
            audio = await asyncio.to_thread(
                elevenlabs_client.text_to_speech.convert,
                text=script,
                voice_id=self.voice_id,
                model_id="eleven_multilingual_v2",
                voice_settings=VoiceSettings(
                    stability=0.5,
                    similarity_boost=0.75,
                    style=0.0,
                    use_speaker_boost=True
                )
            )
            
            # Save audio file
            # In production: Upload to Supabase Storage or S3
            audio_filename = f"call_{self.supplier_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.mp3"
            
            # For now, we just return the filename
            # In production: Save the audio bytes to storage
            # with open(audio_filename, 'wb') as f:
            #     for chunk in audio:
            #         f.write(chunk)
            
            return audio_filename
            
        except Exception as e:
            print(f"  ⚠️  Audio generation failed for {self.supplier_name}: {str(e)}")
            return f"audio_failed_{self.supplier_id}.mp3"
    
    async def _get_supplier_response(self, product_details: Dict) -> Dict:
        """
        Get and process supplier's response to the quotation request.
        
        In production, this would:
        1. Use Twilio to make the actual phone call
        2. Play the ElevenLabs audio
        3. Use Speech-to-Text (Google/Deepgram) to capture response
        4. Parse the response
        
        For now, we simulate an intelligent response using Gemini AI.
        """
        
        # Use Gemini to simulate realistic supplier response
        prompt = f"""
        You are simulating a supplier's response to a procurement quotation call.
        
        Supplier: {self.supplier_name}
        Supplier capabilities: {self.supplier.get('capabilities', {})}
        
        Product requested: {product_details.get('product_description')}
        Quantity: {product_details.get('quantity')}
        Specifications: {product_details.get('specifications', {})}
        
        Based on the supplier's capabilities and the request, decide how they would respond:
        
        1. "yes" - if they can provide a quotation (include realistic price, delivery time, terms)
        2. "no" - if they cannot fulfill this order (include brief reason)
        3. "meeting" - if they want to schedule a meeting to discuss details (include reason)
        
        Return ONLY valid JSON in this exact format:
        {{
            "response_type": "yes|no|meeting",
            "reason": "brief explanation of their response",
            "quotation": {{
                "price_per_unit": 150.00,
                "total_price": 15000.00,
                "currency": "USD",
                "delivery_days": 14,
                "payment_terms": "Net 30",
                "minimum_order": 100,
                "validity_days": 30
            }},
            "meeting_preferences": {{
                "preferred_times": ["2024-11-05 10:00", "2024-11-06 14:00"],
                "reason": "Need to discuss custom specifications"
            }}
        }}
        
        Only include "quotation" if response_type is "yes".
        Only include "meeting_preferences" if response_type is "meeting".
        """
        
        try:
            response = await asyncio.to_thread(
                genai_client.models.generate_content,
                model='gemini-2.0-flash-exp',
                contents=prompt
            )
            
            # Parse JSON from response
            text = response.text.strip()
            if '```json' in text:
                text = text.split('```json')[1].split('```')[0].strip()
            elif '```' in text:
                text = text.split('```')[1].split('```')[0].strip()
            
            parsed_response = json.loads(text)
            
            return parsed_response
            
        except Exception as e:
            print(f"  ⚠️  Response parsing failed: {str(e)}")
            # Return default decline response
            return {
                "response_type": "no",
                "reason": "Unable to process request at this time"
            }
    
    async def _save_call_log(self, product_details: Dict, audio_file: str, response: Dict):
        """
        Save call details to Supabase for tracking and compliance.
        """
        
        call_log = {
            'supplier_id': self.supplier_id,
            'product_requested': product_details.get('product_description'),
            'call_audio_file': audio_file,
            'response_type': response.get('response_type'),
            'response_data': response,
            'timestamp': datetime.now().isoformat()
        }
        
        try:
            await asyncio.to_thread(
                supabase.table('supplier_call_logs').insert(call_log).execute
            )
        except Exception as e:
            print(f"  ⚠️  Failed to save call log: {str(e)}")
    
    async def _process_response(self, response: Dict, product_details: Dict) -> Dict:
        """
        Process the supplier's response and return structured data.
        Also saves relevant data to Supabase.
        """
        
        response_type = response.get('response_type')
        
        if response_type == 'yes':
            # Supplier provided a quotation
            quotation_data = response.get('quotation', {})
            
            # Save quotation to Supabase
            quotation_record = {
                'supplier_id': self.supplier_id,
                'supplier_name': self.supplier_name,
                'quotation_data': quotation_data,
                'reason': response.get('reason'),
                'status': 'pending_approval',
                'created_at': datetime.now().isoformat()
            }
            
            try:
                await asyncio.to_thread(
                    supabase.table('quotations').insert(quotation_record).execute
                )
            except Exception as e:
                print(f"  ⚠️  Failed to save quotation: {str(e)}")
            
            return {
                'supplier_id': self.supplier_id,
                'supplier_name': self.supplier_name,
                'status': 'quotation_received',
                'quotation': quotation_data,
                'reason': response.get('reason'),
                'timestamp': datetime.now().isoformat()
            }
        
        elif response_type == 'no':
            # Supplier declined
            return {
                'supplier_id': self.supplier_id,
                'supplier_name': self.supplier_name,
                'status': 'declined',
                'reason': response.get('reason'),
                'timestamp': datetime.now().isoformat()
            }
        
        elif response_type == 'meeting':
            # Supplier wants a meeting
            meeting_data = response.get('meeting_preferences', {})
            
            # Save meeting request to Supabase
            meeting_request = {
                'supplier_id': self.supplier_id,
                'supplier_name': self.supplier_name,
                'reason': response.get('reason'),
                'preferred_times': meeting_data.get('preferred_times', []),
                'status': 'pending_schedule',
                'created_at': datetime.now().isoformat()
            }
            
            try:
                await asyncio.to_thread(
                    supabase.table('meeting_requests').insert(meeting_request).execute
                )
            except Exception as e:
                print(f"  ⚠️  Failed to save meeting request: {str(e)}")
            
            return {
                'supplier_id': self.supplier_id,
                'supplier_name': self.supplier_name,
                'status': 'meeting_requested',
                'reason': response.get('reason'),
                'meeting_preferences': meeting_data,
                'timestamp': datetime.now().isoformat()
            }
        
        else:
            # Unknown response type
            return {
                'supplier_id': self.supplier_id,
                'supplier_name': self.supplier_name,
                'status': 'error',
                'error': 'Unknown response type',
                'timestamp': datetime.now().isoformat()
            }
