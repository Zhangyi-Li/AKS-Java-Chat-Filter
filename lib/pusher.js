import Pusher from "pusher-js";

let pusherInstance = null;

export const initPusher = () => {
  if (pusherInstance) return pusherInstance;

  const host = process.env.NEXT_PUBLIC_SOKETI_APP_HOST;
  const key = process.env.NEXT_PUBLIC_SOKETI_APP_KEY;
  const appId = process.env.NEXT_PUBLIC_SOKETI_APP_ID || "1";

  console.log("═══════════════════════════════════════════");
  console.log("[PUSHER INIT] Host:", host);
  console.log("[PUSHER INIT] Key:", key);
  console.log("[PUSHER INIT] AppID:", appId);
  console.log("[PUSHER INIT] Attempting to create Pusher instance...");
  console.log(process.env.NEXT_PUBLIC_SOKETI_APP_SECRET);

  if (!host || !key) {
    console.error("[PUSHER ERROR] Missing host or key credentials!");
    return null;
  }

  const isProduction = process.env.NODE_ENV === "production";

  pusherInstance = new Pusher(key, {
    cluster: "mt1",
    wsHost: host,
    wsPort: 443,
    wssPort: 443,
    forceTLS: true,
    encrypted: true,
    enabledTransports: ["ws", "wss"],
    disableStats: true,
    pongTimeout: 30000,
    maxReconnectDelay: 10000,
  });

  console.log(
    "[PUSHER INIT] Instance created, current state:",
    pusherInstance.connection.state,
  );

  pusherInstance.connection.bind("all", (event, ...args) => {
    console.log("[PUSHER ALL EVENTS]", event, args);
  });

  let lastErrorTime = 0;
  let isReconnecting = false;
  let isPageHidden = false;

  // Handle page visibility changes (tab switching)
  const handleVisibilityChange = () => {
    if (document.hidden) {
      console.log("[PUSHER] Page hidden - connection will be paused by Pusher");
      isPageHidden = true;
    } else {
      console.log("[PUSHER] Page visible - attempting reconnection...");
      isPageHidden = false;
      // Force reconnect if needed
      if (pusherInstance.connection.state !== "connected") {
        pusherInstance.connect();
      }
    }
  };

  // Handle online/offline status
  const handleOnline = () => {
    console.log("[PUSHER] Network restored - reconnecting...");
    if (pusherInstance && pusherInstance.connection.state !== "connected") {
      pusherInstance.connect();
    }
  };

  const handleOffline = () => {
    console.log("[PUSHER] Network lost - connection paused");
  };

  // Add event listeners
  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", handleVisibilityChange);
  }
  if (typeof window !== "undefined") {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
  }

  pusherInstance.connection.bind("error", (error) => {
    // Skip errors when page is hidden
    if (isPageHidden) {
      console.log("[PUSHER] Page hidden - skipping error handling");
      return;
    }

    // Only log if error is not a transient timeout (code 1006)
    // Pusher will automatically attempt reconnection
    if (error.code === 1006 || error.data?.code === 1006) {
      console.warn(
        "[PUSHER] Transient connection error (1006), attempting reconnection...",
      );
      isReconnecting = true;
      return; // Don't show error to user - it's auto-recovering
    }

    // Only show persistent errors after 3 seconds without recovery
    const timeSinceLastError = Date.now() - lastErrorTime;
    if (timeSinceLastError > 3000) {
      lastErrorTime = Date.now();
      console.error("[PUSHER ERROR]", error);
      console.error("[PUSHER ERROR] Code:", error.code);
      console.error("[PUSHER ERROR] Data:", error.data);
    }
  });

  pusherInstance.connection.bind("connected", () => {
    if (isReconnecting) {
      console.log(
        "[PUSHER] ✓ Reconnected successfully! Socket ID:",
        pusherInstance.connection.socket_id,
      );
      isReconnecting = false;
    } else {
      console.log(
        "[PUSHER SUCCESS] Connected! Socket ID:",
        pusherInstance.connection.socket_id,
      );
    }
  });

  // Store cleanup function for when component unmounts
  pusherInstance.cleanup = () => {
    if (typeof document !== "undefined") {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    }
    if (typeof window !== "undefined") {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    }
  };

  pusherInstance.connection.bind("state_change", (states) => {
    console.log(
      "[PUSHER STATE CHANGE] Previous:",
      states.previous,
      "→ Current:",
      states.current,
    );
  });

  pusherInstance.connection.bind("disconnected", () => {
    console.log("[PUSHER DISCONNECTED]");
  });

  // Force connection attempt
  pusherInstance.connect();
  console.log("[PUSHER INIT] Connect method called");

  return pusherInstance;
};

export const subscribeToChatChannel = (onMessageReceived) => {
  const pusher = initPusher();
  console.log("═══════════════════════════════════════════");
  console.log("[PUSHER] Subscribing to chat channel...");
  console.log("═══════════════════════════════════════════");
  console.log("[PUSHER] Pusher instance:", pusher);
  console.log("[PUSHER] Connection state:", pusher.connection.state);

  // Try with "public-" prefix which is standard for Pusher-like systems
  const channelName = "public-chat";
  console.log("[PUSHER] Channel name to subscribe:", channelName);

  const channel = pusher.subscribe(channelName);
  console.log("[PUSHER] Channel object:", channel);
  console.log("[PUSHER] Channel name:", channel.name);
  console.log("[PUSHER] Channel subscribed:", channel.subscribed);
  console.log("[PUSHER] Channel type:", channel.type);
  console.log("═══════════════════════════════════════════");

  channel.bind("message-sent", (data) => {
    console.log("╔═════════════════════════════════════════╗");
    console.log("║ [PUSHER] ✓✓✓ MESSAGE RECEIVED ✓✓✓     ║");
    console.log("╚═════════════════════════════════════════╝");
    console.log("[PUSHER] Raw event data:", data);
    console.log("[PUSHER] Data type:", typeof data);
    console.log("[PUSHER] Data keys:", Object.keys(data));
    console.log("[PUSHER] username:", data?.username);
    console.log("[PUSHER] content:", data?.content);
    console.log("[PUSHER] status:", data?.status);
    console.log("[PUSHER] Calling onMessageReceived callback...");
    onMessageReceived(data);
    console.log("[PUSHER] ✓ onMessageReceived callback executed");
    console.log("═════════════════════════════════════════");
  });

  // Log subscription success
  channel.bind("pusher:subscription_succeeded", () => {
    console.log("✓✓✓ [PUSHER] CHANNEL SUBSCRIPTION SUCCEEDED ✓✓✓");
    console.log("[PUSHER] Channel subscribed state:", channel.subscribed);
    console.log("[PUSHER] Channel members:", channel.members?.count);
    console.log("═════════════════════════════════════════");
  });

  // Log subscription error
  channel.bind("pusher:subscription_error", (error) => {
    console.error("✗✗✗ [PUSHER] CHANNEL SUBSCRIPTION ERROR ✗✗✗");
    console.error("[PUSHER] Error:", error);
    console.error("═════════════════════════════════════════");
  });

  return () => {
    console.log("[PUSHER] Unsubscribing from channel:", channelName);
    channel.unbind("message-sent");
    pusher.unsubscribe(channelName);
  };
};

export const broadcastMessage = async (message) => {
  try {
    await fetch("/api/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.error("Failed to broadcast message:", error);
  }
};
