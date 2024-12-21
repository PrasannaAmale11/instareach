// frontend/App.jsx
import React, { useState, useEffect } from 'react';
import backgroundSvg from './assets/bgSvg.svg'


const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const [igBusinessId, setIgBusinessId] = useState(null);
    const [postUrl, setPostUrl] = useState('');
    const [metrics, setMetrics] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [accountData, setAccountData] = useState(null);
    const [searchError, setSearchError] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            handleAuthCallback(code);
        }
    }, []);

    const handleAuthCallback = async (code) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`http://localhost:3000/auth/callback?code=${code}`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Authentication failed');
            }

            setAccessToken(data.accessToken);
            setIgBusinessId(data.igBusinessId);
            setIsAuthenticated(true);
            window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error) {
            setError(error.message || 'Authentication failed. Please try again.');
            console.error('Auth error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        try {
            setError(null);
            const response = await fetch('http://localhost:3000/auth/instagram');
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to initialize login');
            }
            
            window.location.href = data.url;
        } catch (error) {
            setError(error.message || 'Failed to initialize login. Please try again.');
            console.error('Login error:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!postUrl) return;

        try {
            setLoading(true);
            setError(null);
            setMetrics(null);
            
            const response = await fetch('http://localhost:3000/api/post-metrics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postUrl,
                    accessToken,
                    igBusinessId
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch post metrics');
            }
          
            setMetrics(data);
            console.log(data);
            
            
        } catch (error) {
            setError(error.message || 'Failed to fetch post metrics. Please check the URL and try again.');
            console.error('Metrics error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccountSearch = async (e) => {
      e.preventDefault();
      if (!username || !accessToken || !igBusinessId) return;
  
      try {
          setLoading(true);
          setSearchError(null);
          setAccountData(null);
          
  
          const response = await fetch('http://localhost:3000/api/search-account', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  username,
                  accessToken,
                  igBusinessId  
              })
          });
  
          const data = await response.json();
  
          if (!response.ok) {
              throw new Error(data.error || data.details || 'Failed to search account');
          }
  
          setAccountData(data);
          
          // Optional: Log success
          console.log('Found account:', data.user.username);
          console.log('Media count:', data.media.length);
          
      } catch (error) {
          setSearchError(error.message || 'Failed to search account. Please try again.');
          console.error('Account search error:', error);
      } finally {
          setLoading(false);
      }
  };


    return (
        <>
        
        <div
  className="h-screen flex flex-col backgroundPattern relative"
  style={{
    // backgroundImage: `
    //   url(${backgroundSvg})
    // `,
    // backgroundSize: 'cover',
    // backgroundRepeat: 'no-repeat',
  }}
>
    <div className="absolute right-[100px] top-[-110px] z-10 h-[150px] w-[400px] rotate-[0deg] transform rounded-full bg-gradient-to-tl from-slate-800 via-violet-500 to-zinc-400 blur-[150px]"></div>
        <h1 className="text-3xl font-bold mt-8 text-center text-white">Instagram Post Metrics</h1>
      <div className="w-[90%] mx-auto p-6 flex items-center justify-center gap-5">
        <div>
      

      {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-4 rounded">Loading...</div>
          </div>
      )}

      {!isAuthenticated ? (
          <div className="text-center">
              <button
                  onClick={handleLogin}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                  disabled={loading}
              >
                  Login with Instagram
              </button>
          </div>
      ) : (
          <div className="space-y-8">
              {/* New Account Search Form */}
              <div className="bg-gray-50 p-6 rounded-lg w-[500px] border border-gray-400">
                  <h2 className="text-xl font-semibold mb-4">Search Public Account</h2>
                  <form onSubmit={handleAccountSearch} className="space-y-4">
                      <div>
                          <input
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              placeholder="Enter Instagram username (e.g., carryminati)"
                              className="w-full p-2 border rounded"
                          />
                      </div>
                      <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-green-400"
                      >
                          Search Account
                      </button>
                  </form>

                  {searchError && (
                      <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                          {searchError}
                      </div>
                  )}

                  {accountData && (
                      <div className="mt-4">
                          <h3 className="font-medium mb-2">Recent Posts</h3>
                          <div className="grid gap-4">
                              {accountData.media.map((post) => (
                                  <div key={post.id} className="p-4 bg-white rounded shadow">
                                      <p className="text-sm text-gray-600 mb-2">
                                          {new Date(post.timestamp).toLocaleDateString()}
                                      </p>
                                      <p className="mb-2">{post.caption?.substring(0, 100)}...</p>
                                      <button
                                          onClick={() => setPostUrl(post.permalink)}
                                          className="text-blue-600 hover:underline"
                                      >
                                          Use this post URL
                                      </button>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}
              </div>

              {/* Existing Post URL Form */}
              <div className="bg-gray-50 p-6 rounded-lg w-[500px] border border-gray-400">
                  <h2 className="text-xl font-semibold mb-4">Get Post Metrics</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                          <input
                              type="text"
                              value={postUrl}
                              onChange={(e) => setPostUrl(e.target.value)}
                              placeholder="Paste Instagram post URL"
                              className="w-full p-2 border rounded"
                          />
                      </div>
                      <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
                      >
                          {loading ? 'Loading...' : 'Get Metrics'}
                      </button>
                  </form>
              </div>
          </div>
      )}

      {error && (
         <div className={`mt-4 p-4 bg-gray-100 ${error === "This authorization code has been used."? "text-green-400":"text-red-700"}  rounded`}>
              {error}
          </div>
      )}

</div>

{metrics && metrics.data && (
  <div className="mt-8 p-6 bg-gray-50 rounded-lg">
    <h2 className="text-xl font-semibold mb-4">Post Metrics</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {/* Likes */}
      <div className="p-4 bg-white rounded shadow border border-gray-300">
        <h3 className="font-medium text-gray-700">Likes</h3>
        <p className="text-2xl font-bold text-blue-600">
          {metrics.data.find(metric => metric.name === "likes")?.values[0]?.value || 0}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {metrics.data.find(metric => metric.name === "likes")?.description}
        </p>
      </div>

      {/* Comments */}
      <div className="p-4 bg-white rounded shadow border border-gray-300">
        <h3 className="font-medium text-gray-700">Comments</h3>
        <p className="text-2xl font-bold text-blue-600">
          {metrics.data.find(metric => metric.name === "comments")?.values[0]?.value || 0}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {metrics.data.find(metric => metric.name === "comments")?.description}
        </p>
      </div>

      {/* Total Plays */}
      <div className="p-4 bg-white rounded shadow border border-gray-300">
        <h3 className="font-medium text-gray-700">Total Plays</h3>
        <p className="text-2xl font-bold text-blue-600">
          {metrics.data.find(metric => metric.name === "ig_reels_aggregated_all_plays_count")?.values[0]?.value || 0}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {metrics.data.find(metric => metric.name === "ig_reels_aggregated_all_plays_count")?.description}
        </p>
      </div>

      {/* Initial Plays */}
      <div className="p-4 bg-white rounded shadow border border-gray-300">
        <h3 className="font-medium text-gray-700">Initial Plays</h3>
        <p className="text-2xl font-bold text-blue-600">
          {metrics.data.find(metric => metric.name === "plays")?.values[0]?.value || 0}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {metrics.data.find(metric => metric.name === "plays")?.description}
        </p>
      </div>

      {/* Video View Time */}
      <div className="p-4 bg-white rounded shadow border border-gray-300">
        <h3 className="font-medium text-gray-700">Total View Time</h3>
        <p className="text-2xl font-bold text-blue-600">
          {(metrics.data.find(metric => 
            metric.name === "ig_reels_video_view_total_time")?.values[0]?.value / 1000).toFixed(1) || 0}s
        </p>
        <p className="text-sm text-gray-500 mt-1">Total time users spent watching this video</p>
      </div>
    </div>


  </div>
)}


  </div>
  </div>
  </>
    );
};

export default App;