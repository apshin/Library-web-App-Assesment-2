import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BookDetail from './BookDetails';

function BookDetailContainer() {
  const [book, setBook] = useState(null);
  const { title } = useParams();

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        // Check if the book exists in local storage
        const storedBooks = JSON.parse(localStorage.getItem('books'));
        const storedBook = storedBooks.find((storedBook) => storedBook.title === title);

        if (storedBook) {
          setBook(storedBook); // Set book details from local storage
        } else {
          // Fetch book details from the external API if not found in local storage
          const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${title}`);
          if (response.data && response.data.items && response.data.items.length > 0) {
            console.log("Book volumeInfo:", response.data.items[0].volumeInfo);
            const bookData = response.data.items[0].volumeInfo;
            const formattedBook = {
              title: bookData.title,
              authors: bookData.authors || [],
              image: bookData.imageLinks?.thumbnail || '',
              description: bookData.description ? bookData.description : 'No description available'
            };
            setBook(formattedBook);
          } else {
            console.error('No book found with the given title');
          }
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };

    fetchBookDetails();
  }, [title]);

  return (
    <div>
      {book ? (
        <BookDetail book={book} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default BookDetailContainer;
