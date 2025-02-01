from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for simplicity
books = []

class Book(BaseModel):
    id: int
    title: str

@app.get("/books")
def get_books():
    return books

@app.post("/books")
def add_book(book: Book):
    books.append(book)
    return book
