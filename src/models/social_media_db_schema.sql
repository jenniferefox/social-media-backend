CREATE DATABASE social_media_db;

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
