import React, { useState } from "react";
import axios from "axios";

const API_KEY = "AIzaSyBoWJqP6L-Hpu4vzaC7djhZMPVjMuv53tY";
const BASE_URL = "https://www.googleapis.com/youtube/v3";

function KeywordSearchVolume() {
  const [keyword, setKeyword] = useState("");
  const [searchVolume, setSearchVolume] = useState(null);

  const fetchSearchVolume = async () => {
    try {
      const searchResponse = await axios.get(`${BASE_URL}/search`, {
        params: {
          key: API_KEY,
          part: "snippet",
          q: keyword,
          type: "video",
          maxResults: 10, // Adjust as needed
        },
      });

      const videoIds = searchResponse.data.items.map((item) => item.id.videoId);

      const videoResponse = await axios.get(`${BASE_URL}/videos`, {
        params: {
          key: API_KEY,
          part: "statistics",
          id: videoIds.join(","),
        },
      });

      const totalViews = videoResponse.data.items.reduce(
        (total, item) => total + parseInt(item.statistics.viewCount),
        0
      );

      setSearchVolume(totalViews);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <h2>YouTube Keyword Search Volume</h2>
      <div>
        <input
          type="text"
          placeholder="Enter keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button onClick={fetchSearchVolume}>Fetch Search Volume</button>
      </div>
      {searchVolume !== null && (
        <p>
          Search volume for "{keyword}": {searchVolume}
        </p>
      )}
    </div>
  );
}

export default KeywordSearchVolume;
