import Fastify from 'fastify';
import { registerPlugins } from './utils/registerPlugins';
import { registerRoutes } from './utils/registerRoutes';

const fastify = Fastify({
  logger: false
});

const start = async () => {
  
  try {    
    await registerPlugins(fastify);
    await registerRoutes(fastify);

    await fastify.listen({ port: 3000 });
    
    fastify.log.info(`Server listening on port ${3000}`);
  } catch (error) {    
    fastify.log.info(error);
  }
};

[ "SIGINT", "SIGTERM" ].forEach( ( signal ) => {
  process.on( signal, async () => {
    await fastify.close();
  
    process.exit( 0 );
  } );
} );

start();
