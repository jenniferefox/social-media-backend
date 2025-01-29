Import { config } from 'dotenv'

CREATE DATABASE DB_NAME;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100),
  age INTEGER
);

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(25),
  content VARCHAR(150),
  created_at TIMESTAMP DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  content VARCHAR(150),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id1 UUID,
  user_id2 UUID ,
  created TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id1) REFERENCES users(user_id),
  FOREIGN KEY (user_id2) REFERENCES users(user_id)
);


SELECT * FROM users WHERE users.user_id IN (
    (SELECT user_id1 FROM friendships WHERE user_id2 = '29b2d67a-c843-4743-863f-c756f1202aee')
    UNION
    (SELECT user_id2 FROM friendships WHERE user_id1 = '29b2d67a-c843-4743-863f-c756f1202aee')
);
