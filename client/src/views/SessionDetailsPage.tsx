import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {  Music, Youtube } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getUniqueSession } from '@/services/DataService';

interface SessionData {
  _id: { $oid: string };
  userId: { $oid: string };
  sessionName: string;
  spotifyPlaylistLink: string;
  youtubePlaylistLink?: string;
  createdAt: string | number | Date | { $date: string | { $numberLong: string } };
  __v: { $numberInt: string };
}

const SessionDetailsPage: React.FC = () => {
  const [session, setSession] = useState<SessionData | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchSession = async () => {
      if (id) {
        try {
          const data = await getUniqueSession(id);
          setSession(data);
          console.log(data);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchSession();
  }, [id]);

  const formatDate = (dateValue: string | number | Date | { $date: string | { $numberLong: string } }) => {
    let date: Date;
    if (typeof dateValue === 'string' || typeof dateValue === 'number') {
      date = new Date(dateValue);
    } else if (dateValue instanceof Date) {
      date = dateValue;
    } else if (typeof dateValue === 'object' && dateValue !== null) {
      if ('$date' in dateValue) {
        if (typeof dateValue.$date === 'string') {
          date = new Date(dateValue.$date);
        } else if (typeof dateValue.$date === 'object' && '$numberLong' in dateValue.$date) {
          date = new Date(parseInt(dateValue.$date.$numberLong));
        } else {
          return 'Invalid Date';
        }
      } else {
        return 'Invalid Date';
      }
    } else {
      return 'Invalid Date';
    }

    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!session) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="py-28 flex items-center">
    
      <main className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg">
          <CardHeader className="bg-purple-600 text-white">
            <CardTitle className="text-2xl font-bold">{session.sessionName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-purple-600">Session Details</h3>
              <p><strong>Created At:</strong> {formatDate(session.createdAt)}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-purple-600">Playlists</h3>
              <div className="flex space-x-4">
                <Button 
                  variant="outline" 
                  className="border-purple-600 text-purple-600 hover:bg-purple-100"
                  onClick={() => window.open(session.spotifyPlaylistLink, '_blank')}
                >
                  <Music className="mr-2 h-4 w-4" />
                  Spotify Playlist
                </Button>
                {session.youtubePlaylistLink && (
                  <Button 
                    variant="outline" 
                    className="border-purple-600 text-purple-600 hover:bg-purple-100"
                    onClick={() => window.open(session.youtubePlaylistLink, '_blank')}
                  >
                    <Youtube className="mr-2 h-4 w-4" />
                    YouTube Playlist
                  </Button>
                )}
              </div>
            </div>
            
            
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SessionDetailsPage;