import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

import { nanoid } from 'nanoid';

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',

        genReqId: function (req, res) {
          const existingID = req.id ?? req.headers['x-request-id'];
          if (existingID) return existingID;
          const id = nanoid();
          res.setHeader('X-Request-Id', id);
          return id;
        },

        wrapSerializers: true,
        serializers: {
          req: (req) => {
            req.body = req?.raw?.body ?? req?.body; // grpc, tcp 요청을 위한 req?.body 변수
            const customReq = {
              id: req.id,
              method: req.method,
              url: req.url,
              query: req.query,
              params: req.params,
              headers: {
                ...(req?.raw?.headers ?? req?.headers),
                // 로그에 표시하지 않을 헤더 셋팅
                host: undefined,
                connection: undefined,
                'sec-ch-ua': undefined,
                'sec-ch-ua-mobile': undefined,
                referer: undefined,
                'if-none-match': undefined,
                'accept-encoding': undefined,
                'sec-fetch-dest': undefined,
                'sec-fetch-mode': undefined,
                'sec-fetch-site': undefined,
                'sec-ch-ua-platform': undefined,
                'accept-language': undefined,
              },
              body: req.body,
            };
            return customReq;
          },

          res: (res) => {
            return res;
          },
        },
        redact: ['req.body.password'],
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            translateTime: 'SYS:standard',
          },
        },
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class LoggerModule {}
