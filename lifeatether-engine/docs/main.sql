-- Create database
CREATE DATABASE lifeatether;

-- Connect to the database
\c lifeatether

-- Create tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    avatar VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE feeds (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE feed_mentions (
    id SERIAL PRIMARY KEY,
    feed_id INTEGER REFERENCES feeds(id) ON DELETE CASCADE,
    mentioned_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(feed_id, mentioned_user_id)
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    feed_id INTEGER REFERENCES feeds(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    parent_comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (parent_comment_id IS NULL OR parent_comment_id != id)
);

CREATE TABLE comment_mentions (
    id SERIAL PRIMARY KEY,
    comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    mentioned_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(comment_id, mentioned_user_id)
);

CREATE TABLE feed_reactions (
    id SERIAL PRIMARY KEY,
    feed_id INTEGER REFERENCES feeds(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(feed_id, user_id, reaction_type)
);

CREATE TABLE comment_reactions (
    id SERIAL PRIMARY KEY,
    comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(comment_id, user_id, reaction_type)
);

CREATE INDEX idx_feeds_author_id ON feeds(author_id);
CREATE INDEX idx_feed_mentions_feed_id ON feed_mentions(feed_id);
CREATE INDEX idx_feed_mentions_user_id ON feed_mentions(mentioned_user_id);
CREATE INDEX idx_comments_feed_id ON comments(feed_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_comment_id);
CREATE INDEX idx_comment_mentions_comment_id ON comment_mentions(comment_id);
CREATE INDEX idx_comment_mentions_user_id ON comment_mentions(mentioned_user_id);
CREATE INDEX idx_feed_reactions_feed_id ON feed_reactions(feed_id);
CREATE INDEX idx_feed_reactions_user_id ON feed_reactions(user_id);
CREATE INDEX idx_comment_reactions_comment_id ON comment_reactions(comment_id);
CREATE INDEX idx_comment_reactions_user_id ON comment_reactions(user_id);