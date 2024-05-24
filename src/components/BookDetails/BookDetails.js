import React from 'react';
import Header from '../../Header/Header';
import './BookDetails.css';
import Footer from "../../Footer/Footer";

function BookDetail({ book, handleSearchQuery }) {
  return (
    <div div className='pdp-page'>
      <Header handleSearchQuery={handleSearchQuery} />
        <div className='container mb-4'>
          <div className="book-detail mt-5 row justify-content-center">
            <div className='col-12 col-xl-4'>
              <div className="img-container">
                <img src={book.image} alt={book.title} />
              </div>
            </div>
            <div className='col-12 col-xl-6'>
              <h2 className='text-uppercase'>{book.title}</h2>
              {book.description && (
              <p><h4>Description:</h4> {book.description}</p>
            )}
            {/* Check if book.chapters exists before rendering */}
            {book.chapters && (
              <p><h4>Chapters:</h4> {book.chapters}</p>
            )}
            </div>
          </div>
        </div>
      <Footer />
    </div>
  );
}

export default BookDetail;
