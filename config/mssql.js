/*
 * MSSQL DB Config
*/
export default {
	websocket: {
		server: process.env.DB_CONNETION,
    database: "websocket",
		user: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
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