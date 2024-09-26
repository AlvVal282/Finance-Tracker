import React from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Basics.css";

const Home = ({ user, setUser}) => {
    
    const navigate = useNavigate();

    function handleRedirect() {
        navigate('/login');
    }

    const isLoggedIn = () => {
        return user !== null && user.username !== "";
    };
    
    const handleLogout = () => {
        localStorage.removeItem('user'); // Remove user data from localStorage
        setUser({ username: "", id: "" }); // Clear user state
        navigate('/'); // Navigate to home page
    };
    
    return (
        <>
        <div>
            <div className="home-wrapper">
                <h1>Welcome to Personal Finance Tracker!</h1>
                <p>
                    Our Personal Finance Tracker is designed to help you take control of your finances. 
                    Whether you're looking to track your expenses, manage your income, or set up budgets, 
                    our platform provides all the tools you need to make informed financial decisions.
                </p>
                <br />
                <h2>Features</h2>
                <ul>
                    <li>Track expenses and income with ease.</li>
                    <li>Create and manage multiple budgets to stay on top of your spending.</li>
                    <li>Visualize your financial data with intuitive charts and graphs.</li>
                    <li>Secure login and user authentication to keep your data safe.</li>
                </ul>
                <br />
                <h2>How It Works</h2>
                <p>
                    Simply sign up and log in to start tracking your finances. Add your transactions, 
                    set up your budgets, and monitor your financial health with our easy-to-use interface. 
                    Our data visualization tools will provide insights into your spending habits, 
                    helping you make smarter financial decisions.
                </p>
                <br />
                <h2>Get Started</h2>
                <p>
                    Ready to take control of your finances? 
                    {isLoggedIn() ? (
                        <button onClick={handleLogout} style={{ marginLeft: '10px', padding: '10px', fontSize: '16px' }}>
                            Log Out Now
                        </button>
                    ) : (
                        <button onClick={handleRedirect} style={{ marginLeft: '10px', padding: '10px', fontSize: '16px' }}>
                            Log In Now
                        </button>
                    )} 
                </p>
            </div>
        </div>
        </>
    );
};

export default Home;
