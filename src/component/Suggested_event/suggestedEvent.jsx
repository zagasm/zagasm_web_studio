import React, { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import SuggestedFriendsLoader from '../assets/Loader/SuggestedFriendsLoader';
import heart_icon  from  '../../assets/navbar_icons/heart_icon.png';
const firstNames = [
  'Alex', 'Fatima', 'Daniel', 'Linda', 'Chinedu', 'Musa', 'Grace', 'James', 'Amina', 'John',
  'Tolu', 'Sophia', 'Samuel', 'Zainab', 'Emeka', 'Amaka', 'Michael', 'Ada', 'Benjamin', 'Esther',
  'Nneka', 'Peter', 'Ifeanyi', 'Joy', 'Tunde', 'Chioma', 'David', 'Halima', 'Kelvin', 'Ngozi'
];
const lastNames = [
  'Johnson', 'Musa', 'Smith', 'Okafor', 'Obi', 'Garba', 'Williams', 'Ahmed', 'Brown', 'Eze',
  'Ibrahim', 'Uche', 'Taylor', 'Aliyu', 'Green', 'Onyeka', 'Bello', 'Thomas', 'Olamide', 'George',
  'Okon', 'Edet', 'Nwachukwu', 'Osagie', 'Abiola', 'Balogun', 'Okoye', 'Abubakar', 'Effiong', 'Mohammed'
];
const generateRandomUsers = (count) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    const gender = Math.random() > 0.5 ? 'men' : 'women';
    const picId = Math.floor(Math.random() * 90) + 1;
    const name = `${first} ${last}`;
    const username = `${first.toLowerCase()}${last.toLowerCase()}`;
    const image = `https://randomuser.me/api/portraits/${gender}/${picId}.jpg`;
    const fallbackSeed = `${first}${last}${i}`; // Stable random seed
    users.push({ name, username, image, fallbackSeed });
  }
  return users;
};
function ImageWithLoader({ src, alt, fallbackSeed, size = 65 }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const fallbackAvatar = `https://picsum.photos/seed/${fallbackSeed}/${size}`;
  return (
    <div className="position-relative" style={{ width: size, height: size }}>
      <img
        src={error ? fallbackAvatar : src}
        alt={alt}
        width={size}
        height={size}
        className=""
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
        style={{
          objectFit: 'cover',
          display: loaded ? 'block' : 'none',
        }}
      />
    </div>
  );
}
function SuggestedEvent() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setUsers(generateRandomUsers(15));
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  if (loading) {
    return (
      // <SuggestedFriendsLoader/>
      <div className="p-4 text-center">
        <Spinner animation="grow" variant="primary" />
        <p className="mt-2">Loading Events</p>
      </div>
    );
  }

  return (
    <div className="box shadow-s rounded bg-white mb-3 ">
      <div className="box-title border-botto p-3">
        <h6 className="m-0 text-dark">Event for you...</h6>
      </div>
      <div className="box-body p-3">
        {users.map((user, index) => (
          <div className="d-flex align-items-center osahan-post-header mb-3 people-list" key={index}>
            <div className="dropdown-list-imag mr-3 position-relative">
              <ImageWithLoader src={user.image} alt={user.name} fallbackSeed={user.fallbackSeed} />
            </div>
            <div className="font-weight-bold mr-2">
              <p className="text-truncate m-0">{user.name}</p>
              <div className="small text-gray-500">The Trail Band</div>
              <div className="small text-gray-500 mb-3">Fri, 30 July . 23:00</div>
              <div className='font-weight-bold'>$15</div>
            </div>
            <span className="ml-auto">
              <img src={heart_icon} alt="" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SuggestedEvent;
