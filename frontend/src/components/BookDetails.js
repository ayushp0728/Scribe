import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { Page, Text, View, Document, PDFViewer, StyleSheet } from "@react-pdf/renderer";
import { db } from "../firebase";
import "./BookDetails.css";

const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    marginTop: 5,
  },
});

const BookDetails = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookDoc = await getDoc(doc(db, "books", bookId));
        if (bookDoc.exists()) {
          setBook({ id: bookDoc.id, ...bookDoc.data() });
        } else {
          console.log("No such book found!");
        }
      } catch (error) {
        console.error("Error fetching book details: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  // PDFDocument component to display book details in PDF format
  const PDFDocument = () => (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Book Details</Text>
          <Text style={styles.label}>Title: {book.name}</Text>
          <Text style={styles.label}>Description: {book.description}</Text>
          <Text style={styles.label}>Book Type: {book.book_type}</Text>
        </View>
      </Page>
    </Document>
  );

  return (
    <div className="book-details-container">
      {loading ? (
        <p>Loading...</p>
      ) : book ? (
        <>
          <p>{book.name}</p>
          <p><strong>Type:</strong> {book.book_type}</p>
          <p>{book.description}</p>
          {book.bucket_link ? (
            <a href={book.bucket_link} target="_blank" rel="noopener noreferrer">
              <i className="fas fa-file-pdf"></i> View PDF
            </a>
          ) : (
            <PDFViewer style={{ width: "100%", height: "500px" }}>
              <PDFDocument />
            </PDFViewer>
          )}
        </>
      ) : (
        <p>Book not found.</p>
      )}
    </div>
  );
};

export default BookDetails;
