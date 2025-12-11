"use client";

import React, { createContext, useContext, useRef } from "react";
import { LiveAvatarSession } from "@heygen/liveavatar-web-sdk";

interface LiveAvatarContextType {
    sesssionRef: React.MutableRefObject<LiveAvatarSession | null>;
}

const LiveAvatarContext = createContext<LiveAvatarContextType | undefined>;

export const LiveAvatarContextProvider: React.FC<{
    children: React.ReactNode;
    sessionAccessToken: string;
}> = ({ children, sessionAccessToken }) => {
    const sessionRef = useRef<LiveAvatarSession | null>(null);

    if (!sessionRef.current) {
        sessionRef.current = new LiveAvatarSession(sessionAccessToken);
    }

    return (
        <LiveAvatarContext.Provider value={{ sessionRef }}>
            {children}
        </LiveAvatarContext.Provider>
    );
};

export const useLiveAvatarSession = () => {
    const context = useContext(LiveAvatarContext);
    if (context === undefined) {
        throw new Error("useLiveAvatarContext must be used within a LiveAvatarContextProvider");
    }
    return context;
};