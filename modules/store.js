import MSSQLStore from 'connect-mssql-v2';
import dbConfig from '../config/mssql.js';

/*
 * Store Module
 */
const store = {
	object: null,

	get: {
		config() {
			return dbConfig[([process.env.NODE_ENV] == 'production' ? 'websocket' : 'websocket')];
		},
		options() {
			return {
				table: '[sessions]',
				ttl: 1000 * 60 * 60 * 24 * 7,
				autoRemove: true,
				autoRemoveInterval: 1000 * 60 * 10,
				autoRemoveCallback: () => {
				},
				useUTC: true,
			};
		},
	},
  
	init() {
		this.object = new MSSQLStore(this.get.config(), this.get.options());

		this.object.on('connect', () => {
			console.log('Session Store Connected');
		});

		this.object.on('error', (error) => {
			console.log('Session Store Connected');
			console.error(error);
		});

		this.object.on('sessionError', (error, classMethod) => {
			console.log('Session Store Connected');
			console.error(error);
			console.error(classMethod);
		});
	},
};

store.init();

export default store;