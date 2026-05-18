import requests

url = "http://127.0.0.1:8000/api/v1/graph-peak/analyze"
file_path = r"C:\MiniProject\GraphPeakIdentifier\new.csv"

with open(file_path, "rb") as f:
    files = {"file": ("new.csv", f, "text/csv")}
    try:
        response = requests.post(url, files=files)
        print("Status Code:", response.status_code)
        if response.status_code != 200:
            print("Response:", response.text)
        else:
            print("Success!")
    except Exception as e:
        print("Error:", e)
