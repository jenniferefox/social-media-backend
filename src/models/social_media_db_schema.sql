CREATE DATABASE social_media_db;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Don't need gen_random_uuid() in SQL table now.

CREATE TABLE users (
  user_id UUID PRIMARY KEY NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
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
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  user_id UUID NOT NULL,
  content VARCHAR(150),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  user_id1 UUID NOT NULL,
  user_id2 UUID NOT NULL,
  created TIMESTAMP DEFAULT NOW() NOT NULL,
  FOREIGN KEY (user_id1) REFERENCES users(user_id),
  FOREIGN KEY (user_id2) REFERENCES users(user_id)
);


SELECT * FROM users WHERE users.user_id IN (
    (SELECT user_id1 FROM friendships WHERE user_id2 = '29b2d67a-c843-4743-863f-c756f1202aee')
    UNION
    (SELECT user_id2 FROM friendships WHERE user_id1 = '29b2d67a-c843-4743-863f-c756f1202aee')
);
