from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.plans import router as plans_router
from routers.progress import router as progress_router
from routers.auth import router as auth_router

app = FastAPI(title="Devotional App API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(plans_router)
app.include_router(progress_router)
app.include_router(auth_router)


@app.get("/")
def read_root():
    return {"message": "Devotional API is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}