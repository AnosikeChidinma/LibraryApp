import supertest from "supertest";
import express from 'express'
import app from "../app";
import fs from 'fs';
import path from 'path';




describe("Users creation and Authentication", () => {

    test("should create a new user", async () => {
        const logUser = {
            userName: "nnma0012",
               email: `testingnnm45${Math.random().toString(36).substring(2, 7)}@gmail.com`,
            password: "675454"
        };
 
const res = await supertest(app).post(`/users/signup`).send(logUser);
expect(res.statusCode).toBe(200);
expect(res.body).toHaveProperty("message");    
expect(res.body).toHaveProperty("newUser");
expect(res.body.newUser).toHaveProperty("id");
expect(res.body.message).toEqual("newUser has successfully been created");

   });
     
   test("should test for existing email", async () => {
    const logUser = {
        userName: "Chinma",
           email: "Chidinma@gmail.com",
        password: "675454"
      };
      const res = await supertest(app).post(`/users/signup`).send(logUser);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message");    
      expect(res.body.message).toEqual("The email already exists");

  });

  test("should test for user login", async () => {
    let token = "";
    const logUser = {
        userName: "Chinma",
        email: "Chidinma@gmail.com",
        password: "675454",
    };
      const resLogin = await supertest(app).post(`/users/access`).send(logUser);
      token = resLogin.body.generatedToken;
      const res = await supertest(app).post(`/users/access`).send(logUser).set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("email");
      expect(res.body.message).toEqual("successfully logged in");

  });

  test("should test for non-existing user", async () => {
    const logUser = {
        userName: "Chinmaaaaaa",
           email: "Chidinnnnnnnnma@gmail.com",
        password: "675454"
      };
      const res = await supertest(app).post(`/users/access`).send(logUser);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message");
    //   expect(res.body).toHaveProperty("email");
    //   expect(res.body).toHaveProperty("token");    
      expect(res.body.message).toEqual("This user does not exist");

  }); 

});


