import supertest from "supertest";
import express from 'express';
import app from "../app";
import path from "path";
import fs from "fs";
import { viewAllBooks } from "../engine/bookEngine";

let token = "";
const logUser = {
    email: "Chidinma@gmail.com",
    password: "675454",
};
describe("Books Routes", () => {
    test("should create a new book", async () => {
        const newBook = {
        title: `The fruits of Honesty is God's blessinnggs ${Math.random().toString(36).substring(2, 7)}`,
        author: "Cateryn Kolmann",
        datePublished: "1969",
        description: "Miracles",
        pageCount: "900",
        genre: "God's greatness",
        publisher: "Chinma's publishers"   
        };
        const resLogin = await supertest(app).post(`/users/access`).send(logUser);
        token = resLogin.body.generatedToken;
        const res = await supertest(app)
            .post(`/book/create`)
            .send(newBook)
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message");    
        expect(res.body).toHaveProperty("newBook");
        expect(res.body.newBook).toHaveProperty("bookId");
        expect(res.body.message).toEqual("Book successfully added");

        const bookid = res.body.newBook.bookId;

    });

    test("should test for existing book", async () => {
        const existingBook = {
            title: "Bina Boy 3",
            author: "Chidinma Anosike",
            datePublished: "1900",
            description: "Naughty",
            pageCount: "1100",
            genre: "Honest",
            publisher: "Nma's Publishing Company",
          };

          const resLogin = await supertest(app).post(`/users/access`).send(logUser );
          token = resLogin.body.generatedToken;
          const res = await supertest(app)
          .post(`/book/create`)
          .send(existingBook)
          .set("Authorization", `Bearer ${token}`);
          expect(res.statusCode).toBe(400);
          expect(res.body).toHaveProperty("message");    
          expect(res.body.message).toEqual("Book already available");
    
      });


  test("should update an existing book", async () => {
    const updatedBook = {
      title: "The fruit of Honesty is God's blessinggs",
      author: "Cateryn Kolmann",
      datePublished: "2023",
      description: "Updated Version ",
      pageCount: "500",
      genre: "God's Boundless Love",
      publisher: "Chidinma's publishers"
    };

    // Update the book
    const res = await supertest(app)
      .put(`/book/update/1ce7292a-bdf6-46d9-b783-beeed47845c0`)
      .send(updatedBook)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("existingBook");
    expect(res.body.existingBook).toHaveProperty("bookId");
    expect(res.body.message).toEqual("Book successfully updated");
  });

  test("should delete an existing book", async () => {
    const deleteBook = {
        title: "Bina Boy 55",
        author: "Chidinma Anosike",
        datePublished: "1900",
        description: "Naughty",
        pageCount: "1100",
        genre: "Honest",
        publisher: "Nma's Publishing Company"
      
    }
    const resDelete = await supertest(app)
    .delete(`/book/deletebook/43107294-bd0f-447e-bc78-8c0c41a6f12a`)
    .send(deleteBook)
    .set("Authorization", `Bearer ${token}`);
     
    expect(resDelete.statusCode).toBe(200);
    expect(resDelete.body).toHaveProperty("message");
    expect(resDelete.body.message).toEqual("Book successfully deleted");
  }); 
  
  test("should get allbooks", async () => {
  
    const resLogin = await supertest(app).post(`/users/access`).send(logUser);
    token = resLogin.body.generatedToken;
    const res = await supertest(app)
      .get(`/book/viewbooks`)
      .set("authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Books successfully viewed");

  });

  test("should get book", async () => {
  
    const resLogin = await supertest(app).post(`/users/access`).send(logUser);
    token = resLogin.body.generatedToken;
    const res = await supertest(app)
      .get(`/book/viewbook/eeaa61eb-fb78-4b93-a465-57411c72c8c4`)
      .set("authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toEqual("Book successfully viewed");

  });

});




