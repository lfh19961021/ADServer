/*
 * MSSQL DB Config
*/
export default {
	websocket: {
		server: 'websocket-sql-server.database.windows.net',
    database: "websocket",
		user: '',
		password: '',
    port: 1433,
		requestTimeout: 10000,
		pool: {
			max: 10,
			min: 0,
			idleTimeoutMillis: 30000,
		},
		options: {
			encrypt: false,
			trustServerCertificate: false,
		},
	},
};