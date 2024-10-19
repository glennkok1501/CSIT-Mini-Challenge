import json
import math
import heapq
import requests

# Input data
validated_data = json.loads(open("validated_dataset.json", 'r').read())
API = "https://u8whitimu7.execute-api.ap-southeast-1.amazonaws.com/prod"

def getAuthToken():
	data = requests.get(f"{API}/register")
	token = (data.json()["data"]["authorizationToken"])
	return token

# Function to calculate score for each restaurant
def calculate_score(entry):
	rating = entry["rating"]
	distance = entry["distance_from_me"]
	id_ = entry["id"]
	
	# Calculate score
	score = (rating * 10 - distance * 0.5 + math.sin(id_) * 2) * 100 + 0.5
	final_score = round(score / 100, 2)
	return final_score

# Add score to each restaurant and store in a list
for entry in validated_data:
	entry["score"] = calculate_score(entry)

# Use a min-heap to keep track of top 10 restaurants
top_k = []
k = 10

for entry in validated_data:
	# Push the entry with a tuple for the sort order into the heap
	heapq.heappush(top_k, (
		entry["score"],  # Negative to simulate max-heap for score
		entry["rating"],  # Negative to simulate max-heap for rating
		entry["distance_from_me"],  # Negative to simulate max-heap for distance
		entry["restaurant_name"],  # Alphabetically in ascending order
		entry
	))
	
	# Maintain only the top k elements in the heap
	if len(top_k) > k:
		heapq.heappop(top_k)

# Extract top 10 results and sort them as required
top_k_results = [heapq.heappop(top_k)[4] for _ in range(len(top_k))]
top_k_results.sort(key=lambda x: (-x["score"], -x["rating"], -x["distance_from_me"], x["restaurant_name"]))

# Save the result to JSON file
output = [
	{
		"id": entry["id"],
		"restaurant_name": entry["restaurant_name"],
		"rating": entry["rating"],
		"distance_from_me": entry["distance_from_me"],
		"score": entry["score"]
	}
	for entry in top_k_results
]

# Write to JSON file
with open('topk_results.json', 'w') as f:
	json.dump(output, f, indent=4)

check_topk = requests.post(f"{API}/test/check-topk-sort", json={"data": output})
print(check_topk.text)