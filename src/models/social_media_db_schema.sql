CREATE DATABASE social_media_db;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id UUID PRIMARY KEY NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  favourite_animal VARCHAR(100) NOT NULL,
  favourite_colour VARCHAR(100) NOT NULL,
  favourite_snack VARCHAR(100) NOT NULL
);

CREATE TABLE generatedprofilepic (
  picture_id UUID PRIMARY KEY NOT NULL,
  picture_url VARCHAR(2000) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  user_id UUID NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE posts (
  id UUID PRIMARY KEY NOT NULL,
  title VARCHAR(25),
  content VARCHAR(150),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT NOT NULL,
  email VARCHAR(100) NOT NULL,
  content VARCHAR(150),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT NOT NULL,
  email VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE friendships (
  user_id UUID NOT NULL,
  friend_email VARCHAR(100) NOT NULL,
  created TIMESTAMP DEFAULT NOW() NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (friend_email) REFERENCES users(id)
);


SELECT * FROM users WHERE users.email IN (
    (SELECT user_id FROM friendships WHERE friend_email = '29b2d67a-c843-4743-863f-c756f1202aee')
    UNION
    (SELECT friend_email FROM friendships WHERE user_id = '29b2d67a-c843-4743-863f-c756f1202aee')
);
