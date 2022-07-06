import MSSQLStore from 'connect-mssql-v2';
import dbConfig from '../config/mssql.js';

/*
 * Store Module
 */
const store = {
	object: null,

	get: {
		config() {
			return dbConfig['websocket'];
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
		// console.log(this.get.config());
		// console.log(this.get.options());
		this.object = new MSSQLStore(this.get.config(), this.get.options());

		this.object.on('connect', () => {
			console.log('Session Store Connected');
		});

		this.object.on('error', (error) => {
			console.log('Session Store ERROR');
			console.error(error);
		});

		this.object.on('sessionError', (error, classMethod) => {
			console.log('Session Store sessionError');
			console.error(error);
			console.error(classMethod);
		});

		//console.log(this.object);
	},
};

store.init();

export default store;