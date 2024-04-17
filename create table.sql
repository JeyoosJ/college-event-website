-- Users table to store student user information
CREATE TABLE Users (
    UID INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    user_level ENUM('student', 'admin', 'super_admin') NOT NULL
);

-- Universities table to store university profile information
CREATE TABLE Universities (
    university_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    description TEXT,
    number_of_students INT,
    pictures BLOB -- Assuming storing pictures as binary data
);

-- RSOs table to store Registered Student Organizations information
CREATE TABLE RSOs (
    rso_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    admin_id INT, -- Foreign key to Users table
    university_id INT, -- Foreign key to Universities table
    FOREIGN KEY (admin_id) REFERENCES Users(UID),
    FOREIGN KEY (university_id) REFERENCES Universities(university_id)
);

-- Locations table to store event locations
CREATE TABLE Locations (
    location_id INT PRIMARY KEY AUTO_INCREMENT,
    lname VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8)
);

-- Events table to store event information
CREATE TABLE Events (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    event_name VARCHAR(255) NOT NULL,
    event_category ENUM('social', 'fundraising', 'tech_talks', 'other') NOT NULL,
    description TEXT,
    time DATETIME NOT NULL,
    date DATE NOT NULL,
    location_id INT, -- Foreign key to Locations table
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100),
    is_approved BOOLEAN DEFAULT TRUE, -- Whether the event is approved by super admin
    is_private BOOLEAN DEFAULT FALSE, -- Whether the event is private
    is_rso_event BOOLEAN DEFAULT FALSE, -- Whether the event is organized by an RSO
    FOREIGN KEY (location_id) REFERENCES Locations(location_id)
);

-- Comments table to store user comments on events
CREATE TABLE Comments (
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT, -- Foreign key to Events table
    user_id INT, -- Foreign key to Users table
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    text TEXT,
    FOREIGN KEY (event_id) REFERENCES Events(event_id),
    FOREIGN KEY (user_id) REFERENCES Users(UID)
);

-- Ratings table to store event ratings by users
CREATE TABLE Ratings (
    rating_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT, -- Foreign key to Events table
    user_id INT, -- Foreign key to Users table
    rating INT CHECK (rating >= 1 AND rating <= 5), -- Rating scale from 1 to 5 stars
    FOREIGN KEY (event_id) REFERENCES Events(event_id),
    FOREIGN KEY (user_id) REFERENCES Users(UID)
);


CREATE TABLE Events (
    event_id INT PRIMARY KEY,
    event_name VARCHAR(255),
    event_type VARCHAR(50) -- This column will store the type of event (RSO, Private, Public)
);

CREATE TABLE RSO_Events (
    event_id INT PRIMARY KEY,
    FOREIGN KEY (event_id) REFERENCES Events(event_id)
);

CREATE TABLE Private_Events (
    event_id INT PRIMARY KEY,
    FOREIGN KEY (event_id) REFERENCES Events(event_id)
);

CREATE TABLE Public_Events (
    event_id INT PRIMARY KEY,
    FOREIGN KEY (event_id) REFERENCES Events(event_id)
);

ALTER TABLE RSO_Events ADD CONSTRAINT fk_rso_events_events
    FOREIGN KEY (event_id) REFERENCES Events(event_id);

-- Check for intersection between RSO_Events and Private_Events
SELECT COUNT(*)
FROM RSO_Events r
JOIN Private_Events p ON r.event_id = p.event_id;
-- If the count is greater than 0, it means there are events that belong to both RSO and Private, which violates the disjointness constraint.


-- Check for intersection between RSO_Events and Private_Events
SELECT COUNT(*)
FROM RSO_Events r
JOIN Private_Events p ON r.event_id = p.event_id;
-- If the count is greater than 0, it means there are events that belong to both RSO and Private, which violates the disjointness constraint.
