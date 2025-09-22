import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../hooks/useFavorites';

export const FavoritesTest: React.FC = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const { favoriteCarIds, toggleFavorite, isFavorite } = useFavorites();
  const [email, setEmail] = React.useState('admin@gmail.com');
  const [password, setPassword] = React.useState('admin123');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleToggleFavorite = async (carId: number) => {
    try {
      await toggleFavorite(carId);
    } catch (error) {
      console.error('Toggle favorite failed:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Favorites Test</h2>
      
      {!isAuthenticated ? (
        <form onSubmit={handleLogin}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </div>
          <button type="submit" style={{ marginTop: '10px', padding: '5px 10px' }}>
            Login
          </button>
        </form>
      ) : (
        <div>
          <p>Welcome, {user?.name}!</p>
          <button onClick={logout} style={{ padding: '5px 10px' }}>
            Logout
          </button>
          
          <div style={{ marginTop: '20px' }}>
            <h3>Your Favorites: {favoriteCarIds.length}</h3>
            <p>Favorite car IDs: {favoriteCarIds.join(', ') || 'None'}</p>
            
            <div style={{ marginTop: '20px' }}>
              <h4>Test Favorites:</h4>
              {[1, 2, 3, 4, 5].map(carId => (
                <div key={carId} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc' }}>
                  <span>Car ID: {carId}</span>
                  <button
                    onClick={() => handleToggleFavorite(carId)}
                    style={{ marginLeft: '10px', padding: '5px 10px' }}
                  >
                    {isFavorite(carId) ? 'Remove from Favorites' : 'Add to Favorites'}
                  </button>
                  <span style={{ marginLeft: '10px', color: isFavorite(carId) ? 'red' : 'gray' }}>
                    {isFavorite(carId) ? '❤️' : '🤍'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 