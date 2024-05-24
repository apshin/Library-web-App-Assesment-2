import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../../Header/Header';
import './BookList.css';
import { Modal, Button, Pagination, Form } from 'react-bootstrap';
import NavBar from '../../Header/NavBar';
import HeroBanner from '../SearchBar/HeroBanner';
import "../../index.css";
import Footer from '../../Footer/Footer';

function BookList({ loggedIn, guestMode, handleGuestMode, setLoggedIn, setGuestMode }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [show, setShow] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [username, setUsername] = useState('');
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    image: '',
    description: '',
    visibility: 'public'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(10);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        let storedData = localStorage.getItem('books');
        let storedGoogleBooks = localStorage.getItem('googleBooks');
        let formattedBooks = [];
        if (storedData) {
          setBooks(JSON.parse(storedData));
          setLoading(false);
        } else if (guestMode) {
          const response = await axios.get("https://www.googleapis.com/books/v1/volumes?q=programming&maxResults=40");
          const bookItems = response.data.items;
          formattedBooks = bookItems.map(item => ({
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors,
            image: item.volumeInfo.imageLinks?.thumbnail,
            description: item.volumeInfo.description || 'No description available',
            visibility: 'public'
          }));
          setBooks(formattedBooks);
          setLoading(false);
          localStorage.setItem('books', JSON.stringify(formattedBooks));
        }
      } catch (error) {
        console.error('Error fetching books:', error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, [guestMode]);

  const handleSearchQuery = (query) => {
    setSearchQuery(query);
  };

  // Add a New Book
  const handleAddBook = () => {
    if (newBook.title) {
      const id = uuidv4();
      const newBookWithId = { ...newBook, id };
      let updatedBooks;
      if (loggedIn && newBook.visibility === 'private') {
        // Add book only for the logged-in user and set visibility to private
        updatedBooks = [newBookWithId, ...books];
      } else {
        // Add book with public visibility
        updatedBooks = [newBookWithId, ...books];
      }
      setBooks(updatedBooks);
      localStorage.setItem('books', JSON.stringify(updatedBooks));
      setNewBook({
        title: '',
        author: '',
        image: '',
        description: '',
        visibility: 'public'
      });
    } else {
      alert("Please enter a title for the new book.");
    }
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (book.visibility === 'public' || (loggedIn && book.visibility === 'private'))
  );

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const clearBooksFromLocalStorage = () => {
    localStorage.removeItem('books');
    setBooks([]);
  };
  const handleLogout = () => {
    setUsername('');
    setLoggedIn(false);
    setGuestMode(false);
    localStorage.removeItem('user');
  };

  // Get current books
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='book-list'>
      <Header handleSearchQuery={handleSearchQuery} />
      <NavBar />
      <HeroBanner />
      <div className='booklist'>
        <h1 className='text-center mt-4 mb-4'>Book List</h1>
        {loggedIn && (
          <Button className="addnew-btn button-style d-flex" onClick={handleShow}>Add New Book</Button>
        )}
        {!loggedIn && (
          <div className="login-prompt text-center mb-3">
            <p className='fs-5'>Please login to add a new book.</p>
            <Button className="login-btn button-style" onClick={handleLogout}>Login</Button>
          </div>
        )}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Adding New Book</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="new-book-form">
              <h2>Add New Book</h2>
              {loggedIn && (
                <Form onSubmit={handleAddBook}>
                  <Form.Group controlId="formTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" placeholder="Enter title" value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} />
                  </Form.Group>
                  <Form.Group controlId="formAuthor">
                    <Form.Label>Author</Form.Label>
                    <Form.Control type="text" placeholder="Enter author" value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} />
                  </Form.Group>
                  <Form.Group controlId="formImage">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control type="text" placeholder="Enter image URL" value={newBook.image} onChange={(e) => setNewBook({ ...newBook, image: e.target.value })} />
                  </Form.Group>
                  <Form.Group controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={3}  placeholder="Enter description" value={newBook.description} onChange={(e) => setNewBook({ ...newBook, description: e.target.value })} />
                  </Form.Group>
                  <Form.Group controlId="formVisibility">
                    <Form.Label>Visibility</Form.Label>
                    <div className='mb-3'>
                      <Form.Check
                        inline
                        type="radio"
                        label="Public"
                        name="visibility"
                        value="public"
                        checked={newBook.visibility === 'public'}
                        onChange={(e) => setNewBook({ ...newBook, visibility: e.target.value })}
                      />
                      <Form.Check
                        inline
                        type="radio"
                        label="Private"
                        name="visibility"
                        value="private"
                        checked={newBook.visibility === 'private'}
                        onChange={(e) => setNewBook({ ...newBook, visibility: e.target.value })}
                      />
                    </div>
                  </Form.Group>
                  <Button className="button-style" variant="primary" type="submit">
                    Add Book
                  </Button>
                </Form>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn-primary button-style" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        {!loading && (
          <div className='container '>
            <div className='row'>
              {currentBooks.map((book, index) => (
                <div className='col-12 col-md-4 col-xl-3' key={index}>
                  <Link to={`/book/${encodeURIComponent(book.title)}`}>
                    <div className='book-item' onClick={() => handleBookClick(book)}>
                      {book.cover_id && (
                        <img className='book-img' src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`} alt={book.title}/>
                      )}
                      {book.image && (
                        <img className='book-img' src={book.image} alt={book.title} />
                      )}
                      <div className='book-details'>
                        <h3 className='book-title'>{book.title}</h3>
                        {book.authors && (
                          <p className='book-para'><strong>Author:</strong> {book.authors.join(", ")}</p>
                        )}
                        {book.author && (<p><strong>Author:</strong> {book.author}</p>)}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <Pagination>
              {filteredBooks.length > booksPerPage && (
                Array.from({ length: Math.ceil(filteredBooks.length / booksPerPage) }, (_, index) => (
                  <Pagination.Item key={index + 1} onClick={() => paginate(index + 1)} active={index + 1 === currentPage}>
                    {index + 1}
                  </Pagination.Item>
                ))
              )}
            </Pagination>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default BookList;
