import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [user, setUser] = useState('');
    const [userData, setUserData] = useState(null);
    const [repos, setRepos] = useState([]);
    const api = "https://api.github.com/users/";

    const userGetFunction = (name) => {
        axios.get(api + name)
            .then(response => {
                setUserData(response.data);
                repoGetFunction(name);
            })
            .catch(err => {
                if (err.response && err.response.status === 404) {
                    errorFunction("No profile with this username");
                }
            });
    };

    const repoGetFunction = (name) => {
        axios.get(api + name + "/repos?sort=created")
            .then(response => {
                setRepos(response.data.slice(0, 5));
            })
            .catch(err => {
                errorFunction("Problem fetching repos");
            });
    };

    const errorFunction = (error) => {
        setUserData({ error });
        setRepos([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (user) {
            userGetFunction(user);
            setUser('');
        }
    };

    return (
        <div className="container">
            <form className="forminput" onSubmit={handleSubmit}>
                <h1>Github Profile Search</h1>
                <input type="search" value={user} onChange={(e) => setUser(e.target.value)} autoComplete="off" placeholder="Search a Github User" />
            </form>
            <main id="main">
                {userData && !userData.error ? (
                    <div className="card">
                        <div>
                            <img src={userData.avatar_url} alt={userData.name} className="avatar" />
                        </div>
                        <div className="userinfo">
                            <h2>{userData.name || userData.login}</h2>
                            {userData.bio && <p>{userData.bio}</p>}
                            <ul>
                                <li>{userData.followers}<strong>Followers</strong></li>
                                <li>{userData.following}<strong>Following</strong></li>
                                <li>{userData.public_repos}<strong>Repos</strong></li>
                            </ul>
                            <div id="repos">
                                {repos.map(repo => (
                                    <a key={repo.id} className="repo" href={repo.html_url} target="_blank" rel="noopener noreferrer">
                                        {repo.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    userData && <div className="card"><h1>{userData.error}</h1></div>
                )}
            </main>
        </div>
    );
};

export default App;