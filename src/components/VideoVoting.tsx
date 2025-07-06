
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useVideoVoting } from '@/hooks/useVideoVoting';

interface VideoVotingProps {
  videoId: string;
  className?: string;
}

const VideoVoting: React.FC<VideoVotingProps> = ({ videoId, className = "" }) => {
  const { voteForVideo, getVideoVotes, getUserVote } = useVideoVoting();
  
  const votes = getVideoVotes(videoId);
  const userVote = getUserVote(videoId);

  const handleVote = (voteType: 'like' | 'dislike') => {
    voteForVideo(videoId, voteType);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant={userVote === 'like' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleVote('like')}
        className={`transition-all duration-200 ${
          userVote === 'like' 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'hover:bg-green-50 hover:text-green-600 hover:border-green-300'
        }`}
      >
        <ThumbsUp className="w-4 h-4 mr-1" />
        {votes.likes}
      </Button>
      
      <Button
        variant={userVote === 'dislike' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleVote('dislike')}
        className={`transition-all duration-200 ${
          userVote === 'dislike' 
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'hover:bg-red-50 hover:text-red-600 hover:border-red-300'
        }`}
      >
        <ThumbsDown className="w-4 h-4 mr-1" />
        {votes.dislikes}
      </Button>
    </div>
  );
};

export default VideoVoting;
