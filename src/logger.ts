import { noop } from "./libs/utillib";

export enum LogLevel {
	Debug = 'Debug',
	Info = 'Info',
	Warn = 'Warn',
	Error = 'Error',
}

const logger = {
	[LogLevel.Debug]: console.log,
	[LogLevel.Info]: console.info,
	[LogLevel.Warn]: console.warn,
	[LogLevel.Error]: console.error,
};

interface LoggerOptions {
	debug: boolean;
}

class Logger {
	options: LoggerOptions = {
		debug: false,
	};

	_getLogger(level: LogLevel) {
		if (!(level in LogLevel)) {
			level = LogLevel.Debug;
		}

		if (this.options.debug) {
			return logger[level].bind(console, `[${level}]`);
		} else {
			return noop;
		}
	}

	config(options: LoggerOptions) {
		Object.assign(this.options, options);
	}

	get info() {
		return this._getLogger(LogLevel.Info)
	}

	get debug() {
		return this._getLogger(LogLevel.Debug)
	}

	get warn() {
		return this._getLogger(LogLevel.Warn)
	}

	get error() {
		return this._getLogger(LogLevel.Error)
	}
}

export default new Logger();