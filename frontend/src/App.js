import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react'; // Import useState hook
import Login from './Login';
import Admin from './Admin';
import Student from './Student';

function App() {
    const [user, setUser] = useState(null); // Initialize user state

    // Function to set user after successful login
    const handleLoginSuccess = (user) => {
        setUser(user);
    };

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    {/* Pass handleLoginSuccess function as prop to Login component */}
                    <Route path='/' element={<Login handleLoginSuccess={handleLoginSuccess} />} />
                    {/* Pass user as prop to Admin component */}
                    <Route path='/admin' element={<Admin user={user} />} />
                    {/* Pass user as prop to Student component */}
                    <Route path='/student' element={<Student user={user} />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
