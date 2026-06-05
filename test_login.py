import requests
import os

url = "https://fleettrack-api.onrender.com/api/auth/login"
payload = {"email": "superadmin@acf.org", "motDePasse": "test"} # I don't know the password. Let's try something. Wait, the user logs in successfully, so the issue is with the token.
print("We can't login without password.")
