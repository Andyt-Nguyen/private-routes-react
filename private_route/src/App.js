import React, { Component } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Link,
	Redirect,
	withRouter // withRouter() can encapsulate a functional component
						//  and give it the props react-router ex: history.push, location,etc.
} from 'react-router-dom';

// Makes fake authorization with a little bit of delay
// to signify some kind of http request
const fakeAuth = {
	isAuthenticated: false,
	authenticate(cb) {
		this.isAuthenticated = true;
		setTimeout(cb, 100);
	},

	signOut(cb) {
		this.isAuthenticated = false,
		setTimeout(cb, 100)
	}
};

// Routes used to show which routes are displayed to a user
// that is not logged in and one that is logged in
const Public = () => <h3>Public</h3>;
const Protected = () => <h3>Protected</h3>;

// This privateRoute with will need to take in a path as well
// as a component the ...rest is the rest of the props passed to
// the component
const PrivateRoute = ({component:Component, ...rest}) => (
	// This route under the hood is being passed all the props
	// The render method on Route renders our component. So whevever the path
	// matches the path that was passed go ahead and render the function.
	// console.log(rest);
	// return location.path;
	<Route {...rest} render={(props) => {
		return (
		fakeAuth.isAuthenticated
		? <Component {...props} /> //These props are the props from react-router
		// This route will lead them to the login page if they are not authenticated
		// : <Redirect to="/login" />
		: <Redirect to={{ // This redirect is being passed a pathname if they not authenticated
											// but with the state property if they try to login to that route they
											// will be redirected to the page they are trying to go to.
				pathname:"/login",
				state: {from: props.location} //props.location = '/protected'
			}} />
	)}} />
);


class Login extends Component {
	state = { redirectToRefer: false };

	login() {
		fakeAuth.authenticate( () => {
			this.setState({redirectToRefer: true});
		})
	}

	render() {
		const { from } = this.props.location.state || { from: {pathname:'/'}};
		if(this.state.redirectToRefer) {
			return <Redirect to={from} /> // from in this context is the protected page if they
																		// were to go to that url.
		}
		return (
			<div>
				<p>You must log in to view this page at {from.pathname}</p>
				<button onClick={this.login.bind(this)}>Sign in</button>
			</div>
		);
	}
}

const AuthBtn = withRouter((props) => (
	fakeAuth.isAuthenticated
	? <p>
			You are logged in
			<button onClick={() => fakeAuth.signOut(() => props.history.push('/'))}>
				Sign out
			</button>
		</p>
	: <p>You are not logged in</p>
));


class App extends Component {
	render() {
		console.log(fakeAuth.isAuthenticated);
		return (
			<Router>
				<div>
					<AuthBtn />
					<ul>
						<li><Link to="/public">Public Page</Link></li>
						<li><Link to="/protected">Protected Page</Link></li>
					</ul>


					<Route path="/public" component={Public} />
					<Route path="/login" component={Login} />
					<PrivateRoute path="/protected" component={Protected} />

				</div>
			</Router>
		);
	}
}

export default App;
