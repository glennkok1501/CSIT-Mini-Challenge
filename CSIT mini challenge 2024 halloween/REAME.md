# CSIT SOFTWARE ENGINEERING MINI CHALLENGE 2024
https://oct-2024-mini-challenge.csit-events.sg/

## An Undead's Dietary Disaster
Meet Victor the Vampire, a food enthusiast with an unmatched passion for discovering the finest garlic-free restaurants across the country. For generations, his family has been curating a massive database filled with insights on the best eateries that accommodate their unique dietary needs.
As centuries pass, the data has become corrupt. Now Victor is on a mission to fix the database before Halloween so that his family can continue to enjoy deliciously undead meals at top-tier restaurants.

**Your challenge?**   
Help Victor tidy up his database of garlic-free restaurants and shortlist the top 10 places for his big Halloween reunion dinner!

---

## Instructions
Choose one of the following programming languages, ****Python, Javascript, Java or C#** to build 2 client-side programs.

### Program 1
Download the dataset from Victor's server and discard any broken records.

| **Key**          	| **Type**                           	| **Description**                    	|
|------------------	|------------------------------------	|------------------------------------	|
| id               	| integer                            	| Identifier of the restaurant       	|
| restaurant_name  	| string (alphabets and spaces only) 	| Name of the restaurant             	|
| rating           	| float (range: 1.00 to 10.00)       	| Rating of the restaurant           	|
| distance_from_me 	| float (range: 10.00 to 1000.00)    	| Distance from me to the restaurant 	|

Use this example for the data schema of a restaurant
| **Key**          	| **Type**                           	| **Description**                    	|
|------------------	|------------------------------------	|------------------------------------	|
| id               	| integer                            	| Identifier of the restaurant       	|
| restaurant_name  	| string (alphabets and spaces only) 	| Name of the restaurant             	|
| rating           	| float (range: 1.00 to 10.00)       	| Rating of the restaurant           	|
| distance_from_me 	| float (range: 10.00 to 1000.00)    	| Distance from me to the restaurant 	|

```json
{
    "id": 1,
    "restaurant_name": "The Great Restaurant",
    "rating": 9.94,
    "distance_from_me": 150.31
}
```

```
Important!
There is a rate limit in place for downloading data, requiring a 10-second wait between each request.
```

Save the resulting cleaned dataset to a JSON file named `validated_dataset.json`.
```json
[
    {
      "id": 1,
      "restaurant_name": "Bistro Bliss",
      "rating": 9.45,
      "distance_from_me": 98.76,
    },
    {
      "id": 2,
      "restaurant_name": "Savory Spot",
      "rating": 9.12,
      "distance_from_me": 234.56,
    },
    {
      "id": 3,
      "restaurant_name": "Gourmet Garden",
      "rating": 8.76,
      "distance_from_me": 150.78,
    }
    // More restaurants entries added here.
]
```

---

### Program 2
Write an algorithm to sort the cleaned data from program 1 according to the following criteria, in order of priority:
- Score (Sort in descending order)
- Rating (Sort in descending order)
- Distance (Sort in descending order)
- Restaurant name (Sort alphabetically in ascending order)

Calculate the score for each restaurant, using the formula below:
```
score = (rating x 10 - distance x 0.5 + sin(id) x 2) x 100 + 0.5
final_score = round(score / 100, 2)
  
Ensure to round the score to 2 decimal places.
```

Select the top 10 entries and save it to a JSON file named `topk_results.json`.
The output of the JSON file should be in the following structure.
```json
[
    {
      "id": 1,
      "restaurant_name": "The Great Restaurant",
      "rating": 9.94,
      "distance_from_me": 150.31,
      "score": 94.53
    },
    {
      "id": 2,
      "restaurant_name": "Cuisine Delight",
      "rating": 9.20,
      "distance_from_me": 120.00,
      "score": 91.25
    },
    {
      "id": 3,
      "restaurant_name": "The Amazing Eatery",
      "rating": 8.76,
      "distance_from_me": 200.45,
      "score": 89.10
    }
    // There should be 10 restaurant entries in total.
]
```

```
Important!
The expected time and space complexity for this program are as follows:
- Time complexity: O(N log K)
- Space complexity: O(K)
Where K = 10 and N is an integer within the range [1...5,000,000].
```

--- 

## BREW APIS BEFORE YOU CAN REST
Connect to Victor's server using this API connection address:
```
https://u8whitimu7.execute-api.ap-southeast-1.amazonaws.com/prod/{ENDPOINT}
```
Integrate the endpoints below into the client-side program solutions:
<details>
<summary>[GET] /register</summary>
Returns authorization token.   
Responses
<table>
    <tr>
        <td><b>Status Code</b></td>
        <td><b>Description</b></td>
    </tr>
    <tr>
        <td>200</td>
        <td>Query successful. Returns authorization token.</td>
    </tr>
</table>
Response Format
<pre><code class="lang-json">data: {
      "authorizationToken": "<Authorization token>",
      "tokenExpiryAt: "<Authorization token expiry>"
}</code></pre>
</details>

<details>
<summary>[POST] /download-dataset</summary>
Returns a paginated dataset of restaurants.  
Payload
<table>
    <tr>
        <td><b>Field</b></td>
        <td><b>Type</b></td>
        <td><b>Description</b></td>
    </tr>
    <tr>
        <td>next_id</td>
        <td>String</td>
        <td>This ID is used for paginating through the dataset to facilitate downloading the full dataset. Initially, it should be sent as empty to start the first download. When the response returns an empty next_id, it indicates that there are no more records to retrieve, marking the end of the dataset.</td>
    </tr>
</table>

Headers
<table>
    <tr>
        <td><b>Field</b></td>
        <td><b>Type</b></td>
        <td><b>Description</b></td>
    </tr>
    <tr>
        <td>authorizationToken</td>
        <td>String</td>
        <td>The token used to authorize API access.</td>
    </tr>
    <tr>
        <td>Content-Type</td>
        <td>String</td>
        <td>Specifies the data format. Set this to "application/json"</td>
    </tr>
</table>

Responses
<table>
    <tr>
        <td><b>Status Code</b></td>
        <td><b>Description</b></td>
    </tr>
    <tr>
        <td>200</td>
        <td>Query successful. Authorization token is valid.</td>
    </tr>
    <tr>
        <td>401</td>
        <td>Unauthorized. Authorization token is missing in request headers request.</td>
    </tr>
    <tr>
        <td>404</td>
        <td>Not Found. Authorization token is invalid.</td>
    </tr>
    <tr>
        <td>429</td>
        <td>Rate limit exceeded.</td>
    </tr>
</table>

Response Format
<pre><code class="lang-json">data: {
    "dataset_url": "<Download URL to json file>",
    "next_id:" "<id for paginating to the next set of data>"
}</code></pre>
</details>

<details>
<summary>[POST] /test/check-data-validation</summary>
Validates cleaned input results.   

Payload
<table>
    <tr>
        <td><b>Field</b></td>
        <td><b>Type</b></td>
        <td><b>Description</b></td>
    </tr>
    <tr>
        <td>Data</td>
        <td>Array of JSON objects</td>
        <td>Submit the final results from Program 1 to validate against. Use this API to test your program before submitting.</td>
    </tr>
</table>

Payload format
<pre><code class="lang-json">"data": [
    {
        "id": 1,
        "restaurant_name": <Name of restaurant>,
        "rating": <Rating of restaurant>,
        "distance_from_me": <Distance away from restaurant>
    },
    {
        "id": 2,
        "restaurant_name": <Name of restaurant>,
        "rating": <Rating of restaurant>,
        "distance_from_me": <Distance away from restaurant>
    },
    ...
]</code></pre>

Responses
<table>
    <tr>
        <td><b>Status Code</b></td>
        <td><b>Description</b></td>
    </tr>
    <tr>
        <td>200</td>
        <td>Query successful. </td>
    </tr>
</table>
Response Format
<pre><code class="lang-json">{
    "message": "Success or Fail"
}</code></pre>
</details>

<details>
<summary>[POST] /test/check-topk-sort</summary>
Validates sorted input results.  

Payload
<table>
    <tr>
        <td><b>Field</b></td>
        <td><b>Type</b></td>
        <td><b>Description</b></td>
    </tr>
    <tr>
        <td>Data</td>
        <td>Array of JSON objects</td>
        <td>Submit the final results from Program 2 to validate against. Use this API to test your program before submitting.</td>
    </tr>
</table>

Payload format
<pre><code class="lang-json">"data": [
    {
        "id": 1,
        "restaurant_name": <Name of restaurant>,
        "rating": <Rating of restaurant>,
        "distance_from_me": <Distance away from restaurant>
    },
    {
        "id": 2,
        "restaurant_name": <Name of restaurant>,
        "rating": <Rating of restaurant>,
        "distance_from_me": <Distance away from restaurant>
    },
    ...
]</code></pre>

Responses
<table>
    <tr>
        <td><b>Status Code</b></td>
        <td><b>Description</b></td>
    </tr>
    <tr>
        <td>200</td>
        <td>Query successful. </td>
    </tr>
</table>
Response Format
<pre><code class="lang-json">{
    "message": "Success or Fail"
}</code></pre>
</details>

## DOCKERISE IT!
Docker is used to store code and its dependencies into a nifty little package called an image. This makes it more convenient to run the code on any machine.
Package your code with Docker and submit it to us! Learn more about Docker on the [official documentation](https://docs.docker.com/get-started/).
- Install [Docker](https://docs.docker.com/get-started/get-docker/) on your machine.
- Write your [Dockerfile](https://docs.docker.com/reference/dockerfile/) according to the code structure and programming language. Below is an example of a Dockerfile written in Python.
```python
FROM python:3.9

WORKDIR /workspace # Set all working directory to /workspace

COPY . /workspace

ENV API_URL="https://u8whitimu7.execute-api.ap-southeast-1.amazonaws.com/prod" # Set the base URL of the API; all endpoints will reference this URL

ENTRYPOINT ["python", "main.py"]
```

- Set the working directory to `/workspace` for both Docker Images.
- In the Dockerfile for the first Docker Images, set the environment variable `API_URL` and ensure all endpoints in your code reference this variable.

Finally, [build and push your image](https://docs.docker.com/get-started/introduction/build-and-push-first-image/) to the public DockerHub repository.
```
docker login 
docker build -t docker-hub-username/your-image-name:tag .
docker push docker-hub-username/your-image-name:tag
```

## READY TO FEAST
Enter both your submissions [here](https://oct-2024-mini-challenge.csit-events.sg/)