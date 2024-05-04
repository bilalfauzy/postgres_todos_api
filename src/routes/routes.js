const authRoute = require('./auth.route')
const todosRoute = require('./todos.route')

const routes = [
    {
        path: "/auth",
        handler: authRoute
    },
    {
        path: "/dashboard",
        handler: todosRoute
    }
]

module.exports = (app) => {
	routes.forEach((router) => {
		app.use(router.path, router.handler);
	});
};