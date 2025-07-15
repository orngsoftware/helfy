from fastapi import FastAPI

app = FastAPI(
    title="Helfy API",
    description="This is Helfy's API documentation",
    root_path="/api/v1"
)

@app.get("/")
def root():
    return {"msg": "Helfy backend is running"}