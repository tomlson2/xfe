#!/bin/bash

# Function to send a single curl request
send_request() {
  curl -X POST -H "Content-Type: application/json" -d '{
    "receiverAddress": "bc1pmmy6puc4at9laz6lklk9v3umxll9nv4mhkd7err80ugtcv024q3sv97t64",
    "projectTitle": "$COUT",
    "amount": 100000,
    "mintTimes": 1
  }' https://brcmintapi-production.up.railway.app/mint
}

# Export the function to make it available to parallel
export -f send_request

# Run the send_request function 10 times in parallel
seq 2 | parallel -j 5 send_request
