"use client"

import { Toaster } from "@/components/ui/sonner";
import { getTeamService } from "@/services/team.service";
import { useTeamStore } from "@/store/team.store";
import { useUserStore } from "@/store/user.store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef, useCallback } from "react";
import io, { Socket } from 'socket.io-client';
import { toast } from "sonner";

// Move QueryClient outside component to prevent recreation on every render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id,hasTeam } = useUserStore();
  const { setTeam, team } = useTeamStore();
  
  // Use ref to track socket and prevent multiple connections
  const socketRef = useRef<Socket | null>(null);
  const isRetrievingTeamRef = useRef(false);

  // Memoized retrieveTeam function (prevents unnecessary recreations)
  const retrieveTeam = useCallback(async () => {
    if (isRetrievingTeamRef.current) return;
    
    try {
      isRetrievingTeamRef.current = true;
      const teamData = await getTeamService();
      setTeam(teamData);
    } catch (error) {
      console.error('Failed to retrieve team:', error);
      toast.error('Failed to load team data');
    } finally {
      isRetrievingTeamRef.current = false;
    }
  }, [setTeam]);

  useEffect(() => {
    // Early return if no user ID
    if (!id) return;

    const initializeTeam = async () => {
      // If team doesn't exist, set up socket connection
      if (!team && !hasTeam) {
        // Clean up existing socket if any
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }

        try {
          socketRef.current = io('ws://localhost:4000', {
            transports: ['websocket'],
            timeout: 10000,
            reconnection: true,
            reconnectionAttempts: 3,
            reconnectionDelay: 1000,
          });

          socketRef.current.on('connect', () => {
            console.log('Socket connected');
            socketRef.current?.emit('join-user-room', id);
          });

          socketRef.current.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            toast.error('Connection error. Please refresh the page.');
          });

          // Listen for team creation completion
          socketRef.current.on('team-created', (data: {
            message: string,
            teamName: string
          }) => {
            console.log('Team created!', data);
            toast.info(`${data.message} - Your Team Name is: ${data.teamName}`);
            retrieveTeam();
            
            // Clean up socket listeners after successful team creation
            if (socketRef.current) {
              socketRef.current.off('team-created');
              socketRef.current.off('team-creation-failed');
              socketRef.current.disconnect();
              socketRef.current = null;
            }
          });

          // Listen for team creation failure
          socketRef.current.on('team-creation-failed', (data) => {
            console.error('Team creation failed:', data);
            toast.error('Failed to create team. Please try again.');
            
            // Clean up socket listeners after failure
            if (socketRef.current) {
              socketRef.current.off('team-created');
              socketRef.current.off('team-creation-failed');
              socketRef.current.disconnect();
              socketRef.current = null;
            }
          });

        } catch (error) {
          console.error('Failed to initialize socket:', error);
          toast.error('Failed to connect. Please refresh the page.');
          // Fallback to retrieving team without socket
          await retrieveTeam();
        }
      } else {
        // If team exists, just retrieve latest data
        await retrieveTeam();
      }
    };

    initializeTeam();

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.off('team-created');
        socketRef.current.off('team-creation-failed');
        socketRef.current.off('connect');
        socketRef.current.off('connect_error');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [id]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}