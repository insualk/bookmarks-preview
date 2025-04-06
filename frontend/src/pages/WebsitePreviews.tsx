import { useState } from "react";
import axios from "axios";
import PreviewCard from "@/components/PreviewCard";

const WebsitePreviews = () => {
  const [urls, setUrls] = useState("");
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPreviews = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/screenshot", { 
        urls: urls.split("\n").map((url) => url.trim()).filter(Boolean)
      }, {
        headers: { "Content-Type": "application/json" }
      });
      // console.log(response)
      if (response.status === 200) {
        setPreviews([...previews, ...response.data.filter(d => d !== null)]);
      }
    } catch (error) {
      console.error("Error fetching previews", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Website Previews</h1>
      <textarea
        placeholder="Enter URLs (one per line)"
        value={urls}
        onChange={(e) => setUrls(e.target.value)}
        rows={5}
        className="w-full p-2 border rounded resize-none"
      />
      <button 
        onClick={fetchPreviews} 
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
      >
        {loading ? "Loading..." : "Get Previews"}
      </button>
      <div className="grid grid-cols-3 gap-x-4 gap-y-2">
        {previews.map((preview, index) => (
          <div className="mr-2 p-2">
          <PreviewCard key={index} preview={preview} />
          </div>
        ))}
      </div>
    </div>
  );
}
export default WebsitePreviews