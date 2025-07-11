"use client"

import { Toaster } from "@/components/ui/sonner";
import { getTeamService } from "@/services/team.service";
import { useTeamStore } from "@/store/team.store";
import { useUserStore } from "@/store/user.store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import io from 'socket.io-client';
import { toast } from "sonner";

const socket = io('ws://localhost:4000');
const queryClient = new QueryClient();


export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {id} = useUserStore()
  const { setTeam } = useTeamStore()
  useEffect(() => {
    // Join user room
    socket.emit('join-user-room', id);
    
    // Listen for team creation completion
    socket.on('team-created', (data:{
      message:string,
      teamName:string
    }) => {
      console.log('Team created!', data);
      toast.info(`${data.message} - Your Team Name is: ${data.teamName}`)
      getTeamService().then((team)=>{
        console.log(team);
        setTeam(team)
      })
      socket.off('team-created');
      socket.off('team-creation-failed');
    });
    
    // Listen for team creation failure
    socket.on('team-creation-failed', (data) => {
      console.log('Team creation failed:', data);
      // Show error notification
      socket.off('team-created');
      socket.off('team-creation-failed');
    });
    
    return () => {
      socket.off('team-created');
      socket.off('team-creation-failed');
    };
  }, [id]);

  return (
    <QueryClientProvider client={queryClient}>
        {children}
      <Toaster />
      </QueryClientProvider>
  );
}
