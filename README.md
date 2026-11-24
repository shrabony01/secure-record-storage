# Secure Record Storage (Authentication-lab-2)

This is a Notes API built with Node.js, Express, MongoDB, Mongoose, and JWT authentication using ES Modules (`type: "module"`). In this lab, I added ownership checks so logged-in users can only view, update, and delete their own notes.

## What I Changed

- **Note Model (`models/Note.js`):** Added a required `user` field referencing the `User` model so each note is linked to the user who created it.

- **Create Note (`POST /api/notes`):** Saved `req.user._id` from the auth middleware into the `user` field when creating a new note.

- **Get Notes (`GET /api/notes`):** Updated the query to `Note.find({ user: req.user._id })` so users only get their own notes back.

- **Update & Delete (`PUT` and `DELETE /api/notes/:id`):** Added an ownership check comparing `note.user.toString()` with `req.user._id` before updating or deleting. If another user tries to edit or delete the note, it returns a `403 Forbidden` status.

## How I Tested It

I tested all the routes in Postman on `http://localhost:3001` using two test accounts (`alice` and `bob`):

- Registered Alice and created a new note with her token (`POST /api/notes`), confirming her user ID was saved on the note.

- Registered Bob and ran `GET /api/notes` with his token, confirming it returned `[]` and didn't show Alice's note.

- Tried `PUT` and `DELETE` on Alice's note ID using Bob's token, confirming both returned `403 Forbidden`.

- Verified Alice could still update and delete her own note with her token.

