# src/agents/parallel_agent.py

import concurrent.futures
from .quotation.quotation_agent import QuotationAgent

class ParallelAgent:
    """
    Manages the parallel execution of QuotationAgents to speed up 
    the process of gathering bids from multiple suppliers.
    """
    def __init__(self):
        # The ParallelAgent creates instances of the agent it needs to manage.
        self.quotation_agent = QuotationAgent()
        print("ParallelAgent is online.")

    def get_quotes_in_parallel(self, suppliers: list, product_details: str) -> list:
        """
        Takes a list of suppliers and uses a thread pool to run a 
        QuotationAgent for each one simultaneously.
        """
        quotes = []
        # We use a ThreadPoolExecutor to manage a pool of worker threads.
        # max_workers can be adjusted based on performance needs.
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            # We submit a new task to the pool for each supplier.
            # The task is to call the 'get_quote' method.
            future_to_supplier = {
                executor.submit(self.quotation_agent.get_quote, supplier, product_details): supplier 
                for supplier in suppliers
            }
            
            # As each future (task) completes, we gather its result.
            for future in concurrent.futures.as_completed(future_to_supplier):
                supplier_name = future_to_supplier[future]
                try:
                    quote_result = future.result()
                    if quote_result:
                        quotes.append(quote_result)
                        print(f"✅ Successfully received quote from {supplier_name}")
                except Exception as exc:
                    print(f"❌ {supplier_name} generated an exception: {exc}")
        
        print(f"Finished gathering all quotes. Total received: {len(quotes)}")
        return quotes