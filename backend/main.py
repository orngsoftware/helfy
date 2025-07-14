from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/")
def root():
    return {"msg": "Helfy backend is running"}


if __name__=="__main__":
    uvicorn.run(app=app, host="0.0.0.0", port=8000)