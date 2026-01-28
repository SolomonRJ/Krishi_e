import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import VoiceAssistant from './components/VoiceAssistant';
import Home from './pages/Home';
import Disease from './pages/Disease';
import Crop from './pages/Crop';
import Fertilizer from './pages/Fertilizer';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const App = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    // Get user location on site load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          console.log("Location obtained:", { latitude, longitude });
          // You might want to store this in localStorage or Context for other components to use
          localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude }));
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Please enable location services for accurate recommendations.");
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  if (!clerkPubKey) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Missing Clerk Publishable Key. Please check .env file.
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey} navigate={(to) => navigate(to)}>
      <Routes>
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

        <Route
          path="*"
          element={
            <>
              <SignedIn>
                <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
                  <Header />
                  <main className="flex-1 container mx-auto px-4 py-6 pb-24">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/disease" element={<Disease />} />
                      <Route path="/crop" element={<Crop />} />
                      <Route path="/fertilizer" element={<Fertilizer />} />
                    </Routes>
                  </main>
                  <VoiceAssistant />
                  <BottomNav />
                </div>
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </ClerkProvider>
  );
};

export default App;
