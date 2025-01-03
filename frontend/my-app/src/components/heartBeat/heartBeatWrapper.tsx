import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { subscribeToHeartbeat } from "@/service/SSE/heartBeatSSE";
import { addEventSource, removeEventSource } from "@/store/eventsourceSlice";

const HeartbeatWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const userId = useSelector((state: RootState) => state.auth.userId);
  
  const lastHeartbeatTime = useRef<number>(Date.now());
  

  useEffect(() => {
    if (accessToken && userId) {
      const onHeartbeatReceived = () => {
        lastHeartbeatTime.current = Date.now(); 
      };

      const eventSource = subscribeToHeartbeat(
        onHeartbeatReceived,
        (error : any) => {
          console.error("Error occurred in heartbeat subscription:", error);
        }
      );

      const eventSourceEntry = {
        id: "heartbeatSource",
        eventSource,
      };
      dispatch(addEventSource(eventSourceEntry));

      const intervalId = setInterval(() => {
        console.log("Triggering heartbeat refresh...");
        eventSource.close(); 
        const newEventSource = subscribeToHeartbeat(
          onHeartbeatReceived,
          (error: any) => {
            console.error("Error occurred in heartbeat subscription:", error);
          }
        );
        dispatch(addEventSource({ id: "heartbeatSource", eventSource: newEventSource }));
      }, 8 * 60 * 1000);

      return () => {
        clearInterval(intervalId);
        dispatch(removeEventSource("heartbeatSource"));
        eventSource.close(); 
      };
    }
  }, [accessToken, userId, dispatch]);

  return <>{children}</>;
};

export default HeartbeatWrapper;
