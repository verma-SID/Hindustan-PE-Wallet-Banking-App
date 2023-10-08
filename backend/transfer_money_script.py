import requests
import threading
import logging

# Configure logging
logging.basicConfig(filename='transfer_log.txt', level=logging.INFO)

# Define the base URL of your API
base_url = "http://localhost:8080"  # Update with your API's URL

# Define the authentication credentials if required
auth = ("username", "password")  # Update with your authentication credentials if needed

# Define the transfer request data for two different transfers
transfer_request_1 = {
    "sourceEmail": "manoj@gmail.com",
    "destinationEmail": "siddhanth.verma@nextuple.com",
    "amount": 100.0
}

transfer_request_2 = {
    "sourceEmail": "manoj@gmail.com",
    "destinationEmail": "sahil@gmail.com",
    "amount": 100.0
}

# List of transfer requests
transfer_requests = [transfer_request_1, transfer_request_2]

# Function to make a transfer request
def transfer_money(transfer_request, transfer_number):
    try:
        response = requests.post(f"{base_url}/money-transfer", json=transfer_request, auth=auth)
        response.raise_for_status()
        logging.info(f"Transfer {transfer_number} successful: {response.text}")
    except requests.exceptions.HTTPError as e:
        if response.status_code == 400:
            logging.error(f"Transfer {transfer_number} failed due to a client error: {response.text}")
        elif response.status_code == 500:
            logging.error(f"Transfer {transfer_number} failed due to a server error: {response.text}")
        else:
            logging.error(f"Transfer {transfer_number} failed with an unexpected error: {e}")

# Use multithreading to transfer money to multiple users concurrently
threads = []
for i, transfer_request in enumerate(transfer_requests, start=1):
    thread = threading.Thread(target=transfer_money, args=(transfer_request, i))
    threads.append(thread)
    thread.start()

# Wait for all threads to complete
for thread in threads:
    thread.join()

print("All transfers completed.")
