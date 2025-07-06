
import { useState, useEffect } from 'react';

interface VideoVotes {
  [videoId: string]: {
    likes: number;
    dislikes: number;
    userVote?: 'like' | 'dislike';
  };
}

export const useVideoVoting = () => {
  const [votes, setVotes] = useState<VideoVotes>({});

  // Load votes from localStorage on mount
  useEffect(() => {
    const savedVotes = localStorage.getItem('maggie-video-votes');
    if (savedVotes) {
      try {
        setVotes(JSON.parse(savedVotes));
      } catch (error) {
        console.log('Error loading saved votes:', error);
      }
    }
  }, []);

  // Save votes to localStorage whenever votes change
  useEffect(() => {
    localStorage.setItem('maggie-video-votes', JSON.stringify(votes));
  }, [votes]);

  const voteForVideo = (videoId: string, voteType: 'like' | 'dislike') => {
    setVotes(prev => {
      const currentVote = prev[videoId];
      const newVote = { ...prev };

      if (!newVote[videoId]) {
        newVote[videoId] = { likes: 0, dislikes: 0 };
      }

      // If user is changing their vote
      if (currentVote?.userVote && currentVote.userVote !== voteType) {
        // Remove previous vote
        if (currentVote.userVote === 'like') {
          newVote[videoId].likes = Math.max(0, newVote[videoId].likes - 1);
        } else {
          newVote[videoId].dislikes = Math.max(0, newVote[videoId].dislikes - 1);
        }
      }

      // If user is removing their vote (clicking same button)
      if (currentVote?.userVote === voteType) {
        newVote[videoId].userVote = undefined;
        return newVote;
      }

      // Add new vote
      if (voteType === 'like') {
        newVote[videoId].likes += 1;
      } else {
        newVote[videoId].dislikes += 1;
      }
      
      newVote[videoId].userVote = voteType;
      return newVote;
    });
  };

  const getVideoVotes = (videoId: string) => {
    return votes[videoId] || { likes: 0, dislikes: 0 };
  };

  const getUserVote = (videoId: string) => {
    return votes[videoId]?.userVote;
  };

  return {
    voteForVideo,
    getVideoVotes,
    getUserVote
  };
};
