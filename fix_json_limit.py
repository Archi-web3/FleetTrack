import re

index_js = "Angular/backend/index.js"
with open(index_js, "r") as f:
    code = f.read()

code = code.replace("app.use(express.json());", "app.use(express.json({ limit: '10mb' }));\napp.use(express.urlencoded({ limit: '10mb', extended: true }));")

with open(index_js, "w") as f:
    f.write(code)

print("JSON limit fixed.")
