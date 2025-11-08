# src/agents/root_agent.py

# --- Import all the specialized agents it needs to control ---
from .parallel_agent import ParallelAgent
from .supplier_scout.supplier_scout_agent import SupplierScoutAgent
from .order_placement.order_placement_agent import OrderPlacementAgent
from .logistics.logistics_agent import LogisticsAgent
from .contract.contract_agent import ContractAgent
from .scheduling.scheduling_agent import SchedulingAgent

class RootAgent:
    """
    The master agent that orchestrates the entire procurement workflow.
    It holds instances of all specialized agents and calls them in sequence.
    """
    def __init__(self):
        # Initialize all the specialized agents (our "tools") 🤖
        self.scout_agent = SupplierScoutAgent()
        self.parallel_agent = ParallelAgent() # This agent will manage the QuotationAgents
        self.order_agent = OrderPlacementAgent()
        self.logistics_agent = LogisticsAgent()
        self.contract_agent = ContractAgent()
        self.scheduling_agent = SchedulingAgent()
        print("RootAgent is online and has initialized all specialized agents.")

    def run_procurement_workflow(self, user_request: dict):
        """
        Executes the main end-to-end procurement workflow.
        """
        print(f"Executing workflow for request: {user_request['product_description']}")

        # Step 1: Use the ScoutAgent to find potential suppliers
        product_details = user_request['product_description']
        suppliers = self.scout_agent.find_suppliers(product_details)
        if not suppliers:
            return {"status": "error", "message": "No suppliers found."}
        
        print(f"Found {len(suppliers)} potential suppliers.")

        # Step 2: Use the ParallelAgent to get quotes from all suppliers simultaneously
        quotes = self.parallel_agent.get_quotes_in_parallel(suppliers, product_details)
        
        # The workflow now PAUSES. The quotes are saved to the DB and await user approval.
        # The frontend will notify us when a quote is approved.
        print("Quotes obtained. Workflow paused, awaiting user approval via the dashboard.")
        return {"status": "pending_approval", "quotes": quotes}

    def resume_workflow_after_approval(self, approved_quote: dict):
        """
        This method is triggered by the orchestrator after the user approves a quote.
        """
        print(f"Workflow resumed for approved quote from: {approved_quote['supplier_name']}")

        # Step 3: Place the order using the OrderPlacementAgent
        order_confirmation = self.order_agent.place_order(approved_quote)
        
        if order_confirmation['status'] == 'confirmed':
            # Step 4: Arrange logistics and generate contracts in parallel
            print("Order confirmed. Arranging logistics and generating contract...")
            delivery_details = self.logistics_agent.arrange_delivery(order_confirmation)
            contract = self.contract_agent.generate_contract(order_confirmation)
            
            return {
                "status": "completed", 
                "order_details": order_confirmation,
                "delivery_info": delivery_details,
                "contract_info": contract
            }
        else:
            return {"status": "error", "message": "Failed to confirm order."}

    def schedule_meeting(self, meeting_request: dict):
        """
        An ancillary workflow for scheduling meetings on demand.
        """
        print(f"Initiating scheduling for: {meeting_request['supplier_name']}")
        return self.scheduling_agent.schedule(meeting_request)