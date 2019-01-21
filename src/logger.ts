import winston from 'winston';
// @ts-ignore
import logzio_transport from 'winston-logzio';
import { format } from 'logform';
import settings from './settings';

interface log {
	level: string
	message: string
	group: string
}

class logger {
	log_inst: any = null;
	logz_inst: any = null;

	log_list: log[] = [];

	constructor() {
		const logFormat = format.combine(
			format.colorize(),
			format.align(),
			format.printf((info: any) => `${info.level}: ${info.message}`)
		);

		this.log_inst = winston.createLogger({
			level: 'debug',
			format: logFormat,
			transports: [
				new winston.transports.Console()
			]
		});

		this.logz_inst = winston.createLogger({
			level: 'debug',
			transports: [
				new logzio_transport({
					level: 'debug',
					name: 'king-bot-api',
					token: 'THlrOnExjtQlCfGYWXWSrCrFOdwgmGdh'
				})
			]
		});
	}

	info(obj: any, group: string = 'general'): void {
		const message: string = this.get_string(obj);
		this.log_inst.info(message);
		this.logz_inst.info(this.get_logz_data(message));
		this.log_list.push({
			level: 'info',
			message,
			group
		});
	}

	warn(obj: any, group: string = 'general'): void {
		const message: string = this.get_string(obj);
		this.log_inst.warn(message);
		this.logz_inst.warn(this.get_logz_data(message));
		this.log_list.push({
			level: 'warn',
			message,
			group
		});
	}

	error(obj: any, group: string = 'general'): void {
		const message: string = this.get_string(obj);
		this.log_inst.error(message);
		this.logz_inst.error(this.get_logz_data(message));
		this.log_list.push({
			level: 'error',
			message,
			group
		});
	}

	debug(obj: any, group: string = 'general'): void {
		const message: string = this.get_string(obj);
		this.log_inst.debug(message);
		this.logz_inst.debug(this.get_logz_data(message));
	}

	get_string(obj: any): string {
		if (typeof obj === 'string') {
			return obj;
		}

		return JSON.stringify(obj);
	}

	get_logz_data(obj: any): any {
		return {
			message: obj,
			email: settings.email,
			gameworld: settings.gameworld,
			ip: settings.ip
		};
	}
}

export default new logger();
