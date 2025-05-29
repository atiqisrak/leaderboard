"use client";

import { createContext, useContext, useState } from "react";

const FeedReactionContext = createContext();

export function FeedReactionProvider({ children }) {
    const [reactionUpdates, setReactionUpdates] = useState({});

    const updateFeedReactions = (feedId) => {
        setReactionUpdates(prev => ({
            ...prev,
            [feedId]: Date.now() // Using timestamp as a trigger for updates
        }));
    };

    return (
        <FeedReactionContext.Provider value={{ reactionUpdates, updateFeedReactions }}>
            {children}
        </FeedReactionContext.Provider>
    );
}

export function useFeedReactions() {
    const context = useContext(FeedReactionContext);
    if (!context) {
        throw new Error("useFeedReactions must be used within a FeedReactionProvider");
    }
    return context;
} 