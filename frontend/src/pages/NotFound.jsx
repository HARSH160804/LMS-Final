import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <Link to="/" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                Go back home
            </Link>
        </div>
    );
};

export default NotFound;
