import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as log4js from 'log4js';
import * as path from 'path';
import * as fs from 'fs';

export class Server {
    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    public static bootstrap(): Server {
        return new Server();
    }

    private app: express.Express;

    public config() {
        // view engine setup
        this.app.set('views', path.join(__dirname, '../views'));
        this.app.set('view engine', 'pug');

        // uncomment after placing your favicon in /public
        // this.app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cookieParser());

        this.configLogger();
    }

    public routes() {
        // static
        this.app.use(express.static(path.join(__dirname, '../public')));

        this.loadRoutes(path.join(__dirname, './routes'));

        // catch 404 and forward to error handler
        this.app.use(function (req, res, next) {
            next({ status: 404, message: 'Not Found' });
        });

        // error handler
        this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });
    }

    private constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    private configLogger() {
        const logConfig = fs.readFileSync(path.join(__dirname, '../config/log4js.json')).toJSON as any;

        log4js.configure({
            appenders: logConfig.appenders
        });
        // ### AUTO LEVEL DETECTION
        // http responses 3xx, level = WARN
        // http responses 4xx & 5xx, level = ERROR
        // else.level = INFO
        const logger = log4js.getLogger('Server');
        this.app.use(log4js.connectLogger(logger, { level: logConfig.level }));
    }

    private loadRoutes(dir: string) {
        const router = express.Router();
        fs.readdirSync(dir).forEach((file) => {
            if (file.endsWith('.js')) {
                const route = require(path.join(dir, file)).default;
                route(router);
            }
        })
        this.app.use(router);
    }
}
