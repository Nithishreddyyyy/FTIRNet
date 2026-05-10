from fastapi import FastAPI
app=FastAPI()

@app.get("/")
async def home():
    return {
        "status:ok"
    }

if __name__=="__main__":
    import uvicorn
    uvicorn.run("main:app", port=8000, reload=True)