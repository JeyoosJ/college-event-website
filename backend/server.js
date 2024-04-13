const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "password",
        database: "test"
    })

// Route for registering a new user
app.post("/register", (req, res) => {
    const { username, password, user_level } = req.body;
    const sql = "INSERT INTO Users (username, password, user_level) VALUES (?, ?, ?)";
    db.query(sql, [username, password, user_level], (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Error registering user" });
        }
        return res.status(200).json({ message: "User registered successfully" });
    });
});

// Route for logging in
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM Users WHERE username = ? AND password = ?";
    db.query(sql, [username, password], (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Error logging in" });
        }
        if (data.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        return res.status(200).json({ message: "Login successful", user: data[0] });
    });
});


// Route for fetching list of RSOS
app.get("/rso", (req, res) => {
    const sql = "SELECT * FROM RSOs";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error fetching RSOs:', err);
            return res.status(500).json({ error: "Error fetching RSOs" });
        }
        return res.status(200).json(data);
    });
});

// Route for fetching events for a selected RSO
app.get("/rso/:rsoId/events", (req, res) => {
    const rsoId = req.params.rsoId;
    const sql = "SELECT * FROM Events WHERE rso_id = ?";
    db.query(sql, [rsoId], (err, data) => {
        if (err) {
            console.error('Error fetching events:', err);
            return res.status(500).json({ error: "Error fetching events" });
        }
        return res.status(200).json(data);
    });
});

// Route for creating a new RSO
app.post("/rso", (req, res) => {
    const { name, admin_id, university_id } = req.body;
    const sql = "INSERT INTO RSOs (name, admin_id, university_id) VALUES (?, ?, ?)";
    db.query(sql, [name, admin_id, university_id], (err, data) => {
        if (err) {
            console.error('Error creating RSO:', err);
            return res.status(500).json({ error: "Error creating RSO" });
        }
        return res.status(200).json({ message: "RSO created successfully" });
    });
});

// Route for updating an existing RSO
app.put("/rso/:rsoId", (req, res) => {
    const rsoId = req.params.rsoId;
    const { name, admin_id, university_id } = req.body;
    const sql = "UPDATE RSOs SET name = ?, admin_id = ?, university_id = ? WHERE rso_id = ?";
    db.query(sql, [name, admin_id, university_id, rsoId], (err, data) => {
        if (err) {
            console.error('Error updating RSO:', err);
            return res.status(500).json({ error: "Error updating RSO" });
        }
        return res.status(200).json({ message: "RSO updated successfully" });
    });
});

// Route for deleting an existing RSO
app.delete("/rso/:rsoId", (req, res) => {
    const rsoId = req.params.rsoId;
    const sql = "DELETE FROM RSOs WHERE rso_id = ?";
    db.query(sql, [rsoId], (err, data) => {
        if (err) {
            console.error('Error deleting RSO:', err);
            return res.status(500).json({ error: "Error deleting RSO" });
        }
        return res.status(200).json({ message: "RSO deleted successfully" });
    });
});

// Route for creating a new event
app.post("/events", (req, res) => {
    const { event_name, event_category, description, time, date, location_id, contact_phone, contact_email, is_approved, is_private, is_rso_event } = req.body;
    const sql = "INSERT INTO Events (event_name, event_category, description, time, date, location_id, contact_phone, contact_email, is_approved, is_private, is_rso_event) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [event_name, event_category, description, time, date, location_id, contact_phone, contact_email, is_approved, is_private, is_rso_event], (err, data) => {
        if (err) {
            console.error('Error creating event:', err);
            return res.status(500).json({ error: "Error creating event" });
        }
        return res.status(200).json({ message: "Event created successfully" });
    });
});

// API to get all events
app.get("/events", (req, res) => {
    const sql = "SELECT * FROM Events";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching events:", err);
            res.status(500).json({ error: "Error fetching events" });
        } else {
            res.status(200).json(result);
        }
    });
});

// Route for updating an existing event
app.put("/events/:eventId", (req, res) => {
    const eventId = req.params.eventId;
    const { event_name, event_category, description, time, date, location_id, contact_phone, contact_email, is_approved, is_private, is_rso_event } = req.body;
    const sql = "UPDATE Events SET event_name = ?, event_category = ?, description = ?, time = ?, date = ?, location_id = ?, contact_phone = ?, contact_email = ?, is_approved = ?, is_private = ?, is_rso_event = ? WHERE event_id = ?";
    db.query(sql, [event_name, event_category, description, time, date, location_id, contact_phone, contact_email, is_approved, is_private, is_rso_event, eventId], (err, data) => {
        if (err) {
            console.error('Error updating event:', err);
            return res.status(500).json({ error: "Error updating event" });
        }
        return res.status(200).json({ message: "Event updated successfully" });
    });
});

// Route for deleting an existing event
app.delete("/events/:eventId", (req, res) => {
    const eventId = req.params.eventId;
    const sql = "DELETE FROM Events WHERE event_id = ?";
    db.query(sql, [eventId], (err, data) => {
        if (err) {
            console.error('Error deleting event:', err);
            return res.status(500).json({ error: "Error deleting event" });
        }
        return res.status(200).json({ message: "Event deleted successfully" });
    });
});

// Route for adding comments to an event
app.post("/events/:eventId/comments", (req, res) => {
    const event_id = req.params.eventId;
    const { user_id, text } = req.body; 
    const sql = "INSERT INTO Comments (event_id, user_id, text) VALUES (?, ?, ?)";
    db.query(sql, [event_id, user_id, text], (err, data) => {
        if (err) {
            console.error('Error adding comment:', err);
            return res.status(500).json({ error: "Error adding comment" });
        }
        return res.status(200).json({ message: "Comment added successfully" });
    });
});


// Route for fetching comments for an event
app.get("/events/:eventId/comments", (req, res) => {
    const event_id = req.params.eventId;
    const sql = "SELECT * FROM Comments WHERE event_id = ?";
    db.query(sql, [event_id], (err, data) => {
        if (err) {
            console.error('Error fetching comments:', err);
            return res.status(500).json({ error: "Error fetching comments" });
        }
        return res.status(200).json(data);
    });
});

// Route for updating a comment
app.put("/events/:eventId/comments/:commentId", (req, res) => {
    const eventId = req.params.eventId;
    const { comment_id, text } = req.body;
    const sql = "UPDATE Comments SET text = ? WHERE event_id = ? AND comment_id = ?";
    db.query(sql, [text, eventId, comment_id], (err, data) => {
        if (err) {
            console.error('Error updating comment:', err);
            return res.status(500).json({ error: "Error updating comment" });
        }
        return res.status(200).json({ message: "Comment updated successfully" });
    });
});

// Route for deleting a comment
app.delete("/events/:eventId/comments/:commentId", (req, res) => {
    const eventId = req.params.eventId;
    const commentId = req.params.commentId;
    const sql = "DELETE FROM Comments WHERE event_id = ? AND comment_id = ?";
    db.query(sql, [eventId, commentId], (err, result) => {
        if (err) {
            console.error('Error deleting comment:', err);
            return res.status(500).json({ error: "Error deleting comment" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Comment not found" });
        }
        return res.status(200).json({ message: "Comment deleted successfully" });
    });
});



app.listen(8081, () => { console.log("Server is running on port 8081"); });

