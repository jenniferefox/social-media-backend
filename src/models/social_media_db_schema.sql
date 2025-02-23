CREATE DATABASE social_media_db;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  email VARCHAR(100) PRIMARY KEY NOT NULL,
  name VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  favourite_animal VARCHAR(100) NOT NULL,
  favourite_colour VARCHAR(100) NOT NULL,
  favourite_snack VARCHAR(100) NOT NULL
);

CREATE TABLE generatedprofilepic (
  picture_url VARCHAR(2000) PRIMARY KEY NOT NULL,
  email VARCHAR(100) NOT NULl,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  FOREIGN KEY (email) REFERENCES users(email)
);

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  title VARCHAR(25),
  content VARCHAR(150),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  email VARCHAR(100) NOT NULL REFERENCES users(email) ON DELETE CASCADE
);

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  email VARCHAR(100) NOT NULL,
  content VARCHAR(150),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  email VARCHAR(100) NOT NULL REFERENCES users(email) ON DELETE CASCADE
);

CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  email VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  email VARCHAR(100) NOT NULL REFERENCES users(email) ON DELETE CASCADE
);

CREATE TABLE friendships (
  email VARCHAR(100) NOT NULL,
  friend_email VARCHAR(100) NOT NULL,
  created TIMESTAMP DEFAULT NOW() NOT NULL,
  FOREIGN KEY (email) REFERENCES users(email),
  FOREIGN KEY (friend_email) REFERENCES users(email)
);


SELECT * FROM users WHERE users.email IN (
    (SELECT email FROM friendships WHERE friend_email = '29b2d67a-c843-4743-863f-c756f1202aee')
    UNION
    (SELECT friend_email FROM friendships WHERE email = '29b2d67a-c843-4743-863f-c756f1202aee')
);
