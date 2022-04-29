import React, { useState } from "react";

import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { REMOVE_BOOK } from "../utils/mutations";
import { QUERY_ME } from "../utils/queries";

import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from "react-bootstrap";

import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";

const SavedBooks = () => {
  const { id } = useParams();
  const { loading, data } = useQuery(QUERY_ME, {
    variables: { _id: id },
  });

  const savedBooks = data?.savedBooks || [];

  // use this to determine if `useEffect()` hook needs to run again

  const [deleteBook, { error }] = useMutation(REMOVE_BOOK);

  const [userData, setUserData] = useState({});

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await deleteBook({
        variables: { ...userData },
      });

      setUserData({ ...userData });

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Container>
          <h2>
            {savedBooks.length
              ? `Viewing ${savedBooks.length} saved ${
                  savedBooks.length === 1 ? "book" : "books"
                }:`
              : "You have no saved books!"}
          </h2>
          <CardColumns>
            {savedBooks.map((book) => {
              return (
                <Card key={book.bookId} border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              );
            })}
            {error && <div>Something went wrong...</div>}
          </CardColumns>
        </Container>
      )}
    </>
  );
};

export default SavedBooks;
