const fetchThumbnail = async (videoId) => {
    try {
      const apiKey = 'YOUR_YOUTUBE_API_KEY';
      const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`);
      const data = await response.json();
  
      if (data.items.length > 0) {
        return data.items[0].snippet.thumbnails.high.url; // or any other thumbnail size
      }
  
      return null;
    } catch (error) {
      throw new Error('Error fetching thumbnail');
    }
  };
  
  module.exports = fetchThumbnail;

  

  // https://i.ytimg.com/vi/8UwhoPOO9I0/mqdefault.jpg
  // AIzaSyApT7M470IM34lOH6uVN2txX7_KOx9HRFs
  // https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}