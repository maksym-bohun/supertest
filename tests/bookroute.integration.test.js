const express = require('express');
const request = require('supertest');
const bookRoute = require('../routes/books.route')

const app = express();

app.use(express.json());
app.use('/api/books', bookRoute);

describe('Integration tests for the books API', ()=>{
    it('GET /api/books - success - get all the books', async ()=>{
        const {body, statusCode} = await request(app).get('/api/books');

        expect(body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    author: expect.any(String),
                })
            ])
        )

        expect(statusCode).toBe(200);
    })

    it('POST /api/books - failure on invalid post body', async ()=>{
        const {body, statusCode} = await request(app).post('/api/books').send({name: '', author: 'testAuthor'});

        expect(statusCode).toBe(400);
        expect(body).toEqual(
            {errors: [
                    {
                        location: 'body',
                        msg: 'Book name is required',
                        path: 'name',
                        type: 'field',
                        value: ''
                    }
                ]}
        )
    })

    it('POST /api/books - success test case', async ()=>{
        const {body, statusCode} = await request(app).post('/api/books').send({name: 'testName', author: 'testAuthor'});
        expect(statusCode).toBe(200);
        expect(body).toEqual(
            {message: 'Success'}
        )
    })

    it('PATCH /api/books/:bookId - not found error', async ()=>{
        const testBookId = 5000
        const {body, statusCode} = await request(app).patch('/api/books/'+testBookId).send({name: 'newTestName', author: 'newTestAuthor'});
        expect(statusCode).toBe(404);
        expect(body).toEqual(
            {error: true, message: 'No book with such id'}
        )
    })

    it('PATCH /api/books/:bookId - successfully updated book', async ()=>{
        const bookId = 2
        const {body, statusCode} = await request(app).patch('/api/books/'+bookId).send({name: 'newTestName', author: 'newTestAuthor'});
        expect(statusCode).toBe(201);
        expect(body).toEqual(
            {name: 'newTestName', author: 'newTestAuthor', id: bookId}
        )
    })
})