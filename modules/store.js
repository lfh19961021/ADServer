import MSSQLStore from 'connect-mssql-v2';
import dbConfig from '../config/mssql.js';

/*
 * Store Module
 */
export default {
	object: null,

	get: {
		config() {
			return dbConfig[([process.env.NODE_ENV] == 'production' ? 'salesDashboard' : 'salesDashboardDev')];
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
		store.object = new MSSQLStore.default(store.get.config(), store.get.options());

		store.object.on('connect', () => {
			console.log('Session Store Connected');
		});

		store.object.on('error', (error) => {
			console.log('Session Store Connected');
			console.error(error);
		});

		store.object.on('sessionError', (error, classMethod) => {
			console.log('Session Store Connected');
			console.error(error);
			console.error(classMethod);
		});
	},
};